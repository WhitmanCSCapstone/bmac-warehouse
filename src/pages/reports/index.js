/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import { Spin, Button, Icon, DatePicker, Radio } from 'antd';
import {
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjForFilterableStrings,
  getTableColumnObjBasic
} from '../../utils/misc.js';
import {
  reportKeys,
  reportType2TableName,
  reportType2DateAccessor,
  reportType2FundingSourceRelavancy,
  reportType2DateRangeRelavancy,
  radioValue2ReportType
} from '../../constants/constants';
import { populateTableData, getCSVdata, makeDatesReadable } from './utils';
import { CSVLink } from 'react-csv';
import withAuthorization from '../../components/withAuthorization';
import FundsSourceDropdownMenu from '../../components/FundsSourceDropdownMenu';

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
    this.state = {
      reportType: 'Inventory Shipments',
      reportTypeTableName: 'shipments',
      data: null,
      fundingSource: null,
      dateRange: [],
      reportTypeRadioValue: 1,
      statusRadioValue: 6,
      dataCSV: null,
      filteredData: null,
      renderDownloadComponent: false
    };
  }

  componentDidMount() {
    this.updateTable();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.reportTypeTableName !== prevState.reportTypeTableName ||
      this.state.fundingSource !== prevState.fundingSource ||
      this.state.dateRange !== prevState.dateRange
    ) {
      this.updateTable();
    }
  }

  updateTable = () => {
    this.setState({ dataCSV: null, data: null });
    populateTableData(
      this.state.reportType,
      this.state.fundingSource,
      this.state.dateRange,
      reportType2DateAccessor[this.state.reportType],
      data => {
        this.setState({ data: data });
      }
    );
  };

  createCSV = () => {
    getCSVdata(this.state.data, this.state.reportType, dataCSV => {
      this.setState({ dataCSV: dataCSV });
    });
  };

  onClickFundingSource = val => {
    this.setState({ fundingSource: val });
  };

  onReportTypeChange = e => {
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
    var fundingSourceDisabled = !reportType2FundingSourceRelavancy[this.state.reportType];

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
          <FundsSourceDropdownMenu
            disabled={fundingSourceDisabled}
            fundingSource={this.state.fundingSource}
            onClick={this.onClickFundingSource}
            required={false}
          />

          {
            <RangePicker
              onChange={this.onDateChange}
              format={'MM/DD/YYYY'}
              value={this.state.dateRange}
              disabled={!reportType2DateRangeRelavancy[this.state.reportType]}
            />
          }

          {this.state.data ? (
            <Button type="primary" onClick={this.createCSV}>
              {' '}
              Generate CSV{' '}
            </Button>
          ) : (
            <Button type="primary">
              {' '}
              Generate CSV <Spin indicator={antIcon} />{' '}
            </Button>
          )}

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
