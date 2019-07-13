/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import Moment from 'moment';
import { Spin, Button, Icon, DatePicker, Radio } from 'antd';
import {
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjForFilterableStrings,
  getTableColumnObjBasic,
  sortDataByDate
} from '../../utils/misc.js';
import {
  reportKeys,
  reportType2TableName,
  reportType2DateAccessor,
  reportType2DateRangeRelavancy,
  radioValue2ReportType
} from '../../constants/constants';
import { getCSVdata, makeDatesReadable } from './utils';
import { CSVLink } from 'react-csv';
import withAuthorization from '../../components/withAuthorization';

const antIcon = <Icon type="loading" style={{ fontSize: '1rem', color: 'white' }} spin />;
const { RangePicker } = DatePicker;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  },
  filters: {
    display: 'flex'
  },
  radio: {
    display: 'flex',
    flexDirection: 'column'
  }
};

class Reports extends React.Component {
  constructor(props) {
    super(props);
    const defaultReportType = 'Inventory Shipments';
    const tableName = reportType2TableName[defaultReportType];
    const accessor = reportType2DateAccessor[defaultReportType];
    const dateRange = [Moment().add(-30, 'days'), Moment()];
    this.state = {
      reportType: defaultReportType,
      reportTypeTableName: tableName,
      data: sortDataByDate(props[tableName], accessor, dateRange),
      dateRange: dateRange,
      reportTypeRadioValue: 1,
      statusRadioValue: 6,
      dataCSV: null,
      filteredData: null
    };
  }

  componentDidMount() {
    this.createCSV();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.dateRange !== prevState.dateRange ||
      this.state.reportTypeRadioValue !== prevState.reportTypeRadioValue
    ) {
      const accessor = reportType2DateAccessor[this.state.reportType];
      const data =
        this.state.dateRange.length === 2
          ? sortDataByDate(
              this.props[this.state.reportTypeTableName],
              accessor,
              this.state.dateRange
            )
          : this.props[this.state.reportTypeTableName];
      this.setState({ data: data }, this.createCSV);
    }
  }

  createCSV = () => {
    getCSVdata(
      this.state.data,
      this.state.reportType,
      dataCSV => {
        this.setState({ dataCSV: dataCSV });
      },
      this.props.customers,
      this.props.fundingSources,
      this.props.providers,
      this.props.products
    );
  };

  onReportTypeChange = e => {
    let val = e.target.value.toString();
    let reportType = radioValue2ReportType[val];
    let tableName = reportType2TableName[reportType];
    this.setState({
      reportType: reportType,
      reportTypeTableName: tableName,
      reportTypeRadioValue: e.target.value,
      //reset all the settings
      data: this.props[tableName],
      dataCSV: null,
      filteredData: null
    });
  };

  onDateChange = dateRange => {
    this.setState({
      dateRange: dateRange
    });
  };

  onStatusChange = e => {
    this.setState({
      statusRadioValue: e.target.value
    });
  };

  updateCSVData = () => {
    const sortedData = this.reactTable.getResolvedState().sortedData.map(obj => {
      return obj._original;
    });
    this.setState({ filteredData: sortedData });
  };

  render() {
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
            <Radio disabled={true} value={3}>
              Current Inventory
            </Radio>
            <Radio value={4}>Current Customers</Radio>
            <Radio value={5}>Current Providers</Radio>
          </Radio.Group>
          <Radio.Group
            onChange={this.onStatusChange}
            value={this.state.statusRadioValue}
            style={styles.radio}
          >
            <Radio disabled={true} value={6}>
              Active
            </Radio>
            <Radio disabled={true} value={7}>
              Inactive/Discontinued
            </Radio>
          </Radio.Group>

          {
            <RangePicker
              onChange={this.onDateChange}
              format={'MM/DD/YYYY'}
              value={this.state.dateRange}
              disabled={!reportType2DateRangeRelavancy[this.state.reportType]}
            />
          }

          <CSVLink
            data={
              makeDatesReadable(this.state.filteredData) ||
              makeDatesReadable(this.state.dataCSV) ||
              []
            }
            filename={`${this.state.reportType
              .split(' ')
              .join('_')
              .toLowerCase()}.csv`}
          >
            <Button disabled={this.state.dataCSV ? false : true} icon="download" type="primary">
              CSV
            </Button>
          </CSVLink>
        </div>

        <ReactTable
          data={this.state.dataCSV ? this.state.dataCSV : []}
          ref={r => (this.reactTable = r)}
          onFilteredChange={this.updateCSVData}
          onSortedChange={this.updateCSVData}
          columns={reportKeys[this.state.reportType].map(string => {
            if (string === 'billed_amt' || string === 'unit_weight' || string === 'case_lots') {
              return getTableColumnObjForIntegers(string);
            }
            if (
              string === 'funds_source' ||
              string === 'payment_source' ||
              string === 'funding_source'
            ) {
              return getTableColumnObjForFilterableStrings(string, true);
            }
            if (
              string === 'customer_id' ||
              string === 'provider_id' ||
              string === 'address' ||
              string === 'product'
            ) {
              return getTableColumnObjForFilterableStrings(string);
            }
            if (string === 'recieve_date' || string === 'ship_date') {
              return getTableColumnObjForDates(string);
            } else {
              return getTableColumnObjBasic(string);
            }
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
