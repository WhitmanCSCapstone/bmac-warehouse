/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import { Spin, Dropdown, Button, Icon, DatePicker, Radio, Menu } from 'antd';
import { tableKeys,
         reportKeys,
         reportType2TableName,
         reportType2DateAccessor,
         reportType2FundingSourceRelavancy,
         reportType2DateRangeRelavancy,
         radioValue2ReportType } from '../../constants/constants';
import { populateTableData,
         getCSVdata,
         filterDataByDate,
         cleanFundingSourcesData } from './utils';
import { CSVLink, CSVDownload } from "react-csv";
import withAuthorization from '../../components/withAuthorization';

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
    db.onceGetFundingSources().then(snapshot => {
      var data = cleanFundingSourcesData(snapshot.val());
      this.setState({ fundingSources: data })
    });

    this.updateTable();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reportTypeTableName !== prevState.reportTypeTableName
        || this.state.fundingSource !== prevState.fundingSource
        || this.state.dateRange !== prevState.dateRange) {
      this.updateTable();
      //this.setState({dataCSV: null});
    }
  }

  updateTable = () => {
    populateTableData(this.state.reportTypeTableName,
                      this.state.fundingSource,
                      this.state.dateRange,
                      reportType2DateAccessor[this.state.reportType],
                      (data) => {this.setState({data: data}, console.log('just updated table data'))});
  }

  createCSV = () => {
    getCSVdata(this.state.data,
               this.state.reportType,
               (dataCSV) => {this.setState({dataCSV: dataCSV}),
                             console.log('just updated csv data')
               });
  }

  onClickFundingSource = (e) => {
    this.setState({
      fundingSource: e.key,
    });
  }

  clearFundingSource = () => {
    this.setState({
      fundingSource: null,
    });
  }

  onReportTypeChange = (e) => {
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
    this.setState({
      dateRange: dateRange,
    });
  }

  onStatusChange = (e) => {
    this.setState({
      statusRadioValue: e.target.value,
    });
  }

  render() {

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
            <Radio value={4}>Current Customers</Radio>
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
          columns={reportKeys[this.state.reportType].map(string => {
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

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Reports);
