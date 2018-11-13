/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import { tableKeys, reportKeys } from '../../constants';
import { Spin, Dropdown, Button, Icon, DatePicker, Radio, Menu } from 'antd';
import { reportType2TableName,
         reportType2DateAccessor,
         reportType2FundingSourceRelavancy,
         reportType2DateRangeRelavancy,
         radioValue2ReportType } from '../../constants';
import { populateTableData,
         getCSVdata,
         filterDataByDate,
         cleanFundingSourcesData } from './utils';
import { CSVLink, CSVDownload } from "react-csv";

const antIcon = <Icon type="loading" style={{ fontSize: '1rem', color: 'white' }} spin />;
const { RangePicker } = DatePicker;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  filters: {
    display: 'flex',
  },
  radio: {
    display: 'flex',
    flexDirection: 'column',
  },
};

class Reports extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      reportType: 'Inventory Shipments',
      reportTypeTableName: 'shipments',
      data: null,
      fundingSource: null,
      dateRange: [],
      reportTypeRadioValue: 1,
      statusRadioValue: 6,
      fundingSources: [],
      dataCSV: null,
    }
  }

  componentDidMount(){
    console.log('componentDidMount');
    var database = firebase.database();
    var ref = database.ref('4/fundingsources')
    ref.on('value', (snapshot) => {
      var data = snapshot.val();
      data = cleanFundingSourcesData(data);
      this.setState({
        fundingSources: data
      })
    });;

    this.updateTable();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('component did update');
    if (this.state.reportTypeTableName !== prevState.reportTypeTableName
        || this.state.fundingSource !== prevState.fundingSource
        || this.state.dateRange !== prevState.dateRange) {
      this.updateTable();
      //this.setState({dataCSV: null});
    }
  }

  updateTable = () => {
    console.log('updateTable fired');
    populateTableData(this.state.reportTypeTableName,
                      this.state.fundingSource,
                      this.state.dateRange,
                      reportType2DateAccessor[this.state.reportType],
                      (data) => {this.setState({data: data}, console.log('just updated table data'))});
  }

  createCSV = () => {
    console.log('createCSV fired');
    getCSVdata(this.state.data, this.state.reportTypeTableName, (dataCSV) => {this.setState({dataCSV: dataCSV}), console.log('just updated csv data')});
  }

  onClickFundingSource = (e) => {
    console.log('onClickFundingSource fired');
    this.setState({
      fundingSource: e.key,
    });
  }

  clearFundingSource = () => {
    console.log('clearFundingSource fired');
    this.setState({
      fundingSource: null,
    });
  }

  onReportTypeChange = (e) => {
    console.log('onReportTypeChange fired');
    var val = e.target.value.toString();
    var reportType = radioValue2ReportType[val];
    var tableName = reportType2TableName[reportType];
    this.setState({
      reportType: reportType,
      reportTypeTableName: tableName,
      reportTypeRadioValue: e.target.value,
      //reset all the settings
      data: null,
      fundingSource: null,
      dateRange: [],
      dataCSV: null,
    });
  }

  onDateChange = (dateRange) => {
    console.log('onDateChange fired');
    this.setState({
      dateRange: dateRange,
    });
  }

  onStatusChange = (e) => {
    console.log('onStatusChange');
    this.setState({
      statusRadioValue: e.target.value,
    });
  }

  render() {

    console.log('render fired');

    var menu = (
      <Menu>
        {this.state.fundingSources.map((name) => {
           return(
             <Menu.Item key={name} onClick={this.onClickFundingSource}>
               {name}
             </Menu.Item>
           )
        })}
        <Menu.Item key='None' onClick={this.clearFundingSource}>
          <strong>Any</strong>
        </Menu.Item>
      </Menu>
    )

    var fundingSourceDisabled = !reportType2FundingSourceRelavancy[this.state.reportType];

    return(
      <div style={styles.container}>

        <div style={styles.filters}>
          <Radio.Group onChange={this.onReportTypeChange}
                       value={this.state.reportTypeRadioValue}
                       style={styles.radio}>

            <Radio value={1}>Inventory Shipments</Radio>
            <Radio value={2}>Inventory Receipts</Radio>
            <Radio disabled={true} value={3}>Current Inventory</Radio>
            <Radio disabled={true} value={4}>Current Customers</Radio>
            <Radio disabled={true} value={5}>Current Providers</Radio>

          </Radio.Group>

          <Radio.Group onChange={this.onStatusChange}
                       value={this.state.statusRadioValue}
                       style={styles.radio}>

            <Radio disabled={true} value={6}>Active</Radio>
            <Radio disabled={true} value={7}>Inactive/Discontinued</Radio>

          </Radio.Group>

          {

            <div>
              <Dropdown disabled={fundingSourceDisabled} overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  <Button disabled={fundingSourceDisabled}>
                    {this.state.fundingSource
                     ? this.state.fundingSource
                     : <span>Funding Source</span> } <Icon type="down" />
                  </Button>
                </a>
              </Dropdown>
            </div>
          }

          {
            <RangePicker onChange={this.onDateChange}
                         value={this.state.dateRange}
                         disabled={!reportType2DateRangeRelavancy[this.state.reportType]}
            />
          }

          {
            this.state.data
            ?
            <Button type="primary" onClick={this.createCSV}>Create CSV</Button>
            : <Button type="primary"> Create CSV <Spin indicator={antIcon} />
            </Button>
          }

          {
            this.state.dataCSV
            ? <CSVLink filename={'report.csv'} data={this.state.dataCSV}>
              <Button type="primary" icon="download">
                CSV
              </Button>
            </CSVLink>
            : <Button type="primary">
              CSV <Spin indicator={antIcon} />
            </Button>
          }

        </div>

        <ReactTable
          data={this.state.dataCSV ? this.state.dataCSV : []}
          columns={reportKeys[this.state.reportTypeTableName].map(string => {
              return({
                Header: string,
                accessor: string,
              })
          })}
          defaultPageSize={10}
          className="-striped -highlight"
        />

        <ReactTable
          data={this.state.data ? this.state.data : []}
          columns={tableKeys[this.state.reportTypeTableName].map(string => {
              return({
                Header: string,
                accessor: string,
              })
          })}
          defaultPageSize={10}
          className="-striped -highlight"
        />

      </div>
    );
  }
}

export default Reports;
