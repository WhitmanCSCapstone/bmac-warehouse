/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import {
  Spin,
  Button,
  Icon,
  DatePicker,
  Radio,
} from 'antd';
import { CSVLink } from 'react-csv';
import matchSorter from 'match-sorter';
import Moment from 'moment';
import {
  reportKeys,
  reportType2TableName,
  reportType2DateAccessor,
  reportType2FundingSourceRelavancy,
  reportType2DateRangeRelavancy,
  radioValue2ReportType,
} from '../../constants/constants';
import {
  populateTableData,
  getCSVdata,
} from './utils';
import withAuthorization from '../../components/withAuthorization';
import FundsSourceDropdownMenu from '../../components/FundsSourceDropdownMenu';

const antIcon = <Icon type="loading" style={{ fontSize: '1rem', color: 'white' }} spin />;
const { RangePicker } = DatePicker;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,

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
  constructor(props) {
    super(props);
    this.state = {
      reportType: 'Inventory Shipments',
      reportTypeTableName: 'shipments',
      data: null,
      fundingSource: null,
      dateRange: [],
      reportTypeRadioValue: 1,
      statusRadioValue: 6,
      dataCSV: null,
    };
  }

  componentDidMount() {
    this.updateTable();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reportTypeTableName !== prevState.reportTypeTableName
        || this.state.fundingSource !== prevState.fundingSource
        || this.state.dateRange !== prevState.dateRange) {
      this.updateTable();
    }
  }

  updateTable = () => {
    this.setState({
      dataCSV: null,
      data: null,
    });
    populateTableData(
      this.state.reportType,
      this.state.fundingSource,
      this.state.dateRange,
      reportType2DateAccessor[this.state.reportType],
      (data) => { this.setState({ data }, console.log('just updated table data')); },
    );
  }

  createCSV = () => {
    getCSVdata(
      this.state.data,
      this.state.reportType,
      (dataCSV) => {
        this.setState({ dataCSV });
        console.log('just updated csv data');
      },
    );
  }

  onClickFundingSource = (val) => {
    this.setState({ fundingSource: val });
  }

  onReportTypeChange = (e) => {
    const val = e.target.value.toString();
    const reportType = radioValue2ReportType[val];
    const tableName = reportType2TableName[reportType];
    this.setState({
      reportType,
      reportTypeTableName: tableName,
      reportTypeRadioValue: e.target.value,
      // reset all the settings
      data: null,
      fundingSource: null,
      dateRange: [],
      dataCSV: null,
    });
  }

  onDateChange = (dateRange) => {
    this.setState({
      dateRange,
    });
  }

  onStatusChange = (e) => {
    this.setState({
      statusRadioValue: e.target.value,
    });
  }

  render() {
    const fundingSourceDisabled = !reportType2FundingSourceRelavancy[this.state.reportType];

    return (
      <div style={styles.container}>

        <div style={styles.filters}>
          <Radio.Group
            onChange={this.onReportTypeChange}
            value={this.state.reportTypeRadioValue}
            style={styles.radio}
          >

            <Radio value={1}>Inventory Shipments</Radio>
            <Radio value={2}>Inventory Receipts</Radio>
            <Radio disabled value={3}>Current Inventory</Radio>
            <Radio value={4}>Current Customers</Radio>
            <Radio value={5}>Current Providers</Radio>

          </Radio.Group>

          <Radio.Group
            onChange={this.onStatusChange}
            value={this.state.statusRadioValue}
            style={styles.radio}
          >

            <Radio disabled value={6}>Active</Radio>
            <Radio disabled value={7}>Inactive/Discontinued</Radio>

          </Radio.Group>

          <FundsSourceDropdownMenu
            disabled={fundingSourceDisabled}
            fundingSource={this.state.fundingSource}
            onClick={this.onClickFundingSource}
            required={false}
          />

          {
            <RangePicker
              onChange={this.onDateChange}
              format="MM/DD/YYYY"
              value={this.state.dateRange}
              disabled={!reportType2DateRangeRelavancy[this.state.reportType]}
            />
          }

          {
            this.state.data
            ? <Button type="primary" onClick={this.createCSV}> Create CSV </Button>
            : <Button type="primary"> Create CSV <Spin indicator={antIcon} /> </Button>
          }

          {
            this.state.dataCSV
            ?
              <CSVLink filename="report.csv" data={this.state.dataCSV}>
                <Button type="primary" icon="download">
                CSV
                </Button>
              </CSVLink>
            :
              <Button disabled={!this.state.dataCSV} icon="download" type="primary">
              CSV
              </Button>
          }

        </div>

        <ReactTable
          data={this.state.dataCSV ? this.state.dataCSV : []}
          columns={reportKeys[this.state.reportType].map((string) => {
            if (string === 'customer_id' && this.state.reportType === 'Inventory Shipments') {
              return ({
                Header: string.replace('_', ' ').split(' ')
                              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                              .join(' '),
                accessor: string,
                filterable: true,
                filterAll: true,
                filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['customer_id'] }),
              });
            }
            if (string === 'provider_id' && this.state.reportType === 'Inventory Receipts') {
              return ({
                Header: string.replace('_', ' ').split(' ')
                              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                              .join(' '),
                accessor: string,
                filterable: true,
                filterAll: true,
                filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['provider_id'] }),
              });
            }
            if (string === 'ship_date' || string === 'intial_date' || string === 'recieve_date') {
              return ({
                id: string,
                Header: string.replace('_', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).map(s => s.charAt(0).toUpperCase() + s.substring(1))
                              .join(' '),
                accessor: d => Moment(d.ship_date).local().format('MM/DD/YYYY'),
                sortMethod: (a, b) => {
                  a = new Date(a).getTime();
                  b = new Date(b).getTime();
                  return b > a ? 1 : -1;
                },
              });
            }
            return ({
              Header: string.replace('_', ' ').split(' ')
                            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                            .join(' '),
              accessor: string,
            });
          })}
          defaultPageSize={10}
          className="-striped -highlight"
        />

      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Reports);
