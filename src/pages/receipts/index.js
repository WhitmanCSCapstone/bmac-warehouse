/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { Button, DatePicker } from 'antd';
import { tableKeys } from '../../constants/constants';
import {
  sortDataByDate,
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableStrings,
  getTableColumnObjForFilterableHashes
} from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ReceiptForm from '../../components/form/types/ReceiptForm';
import AddFundsSource from '../../components/AddFundsSource';

const keys = tableKeys['receipts'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  }
};

const { RangePicker } = DatePicker;

class Receipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null,
      providers: null
    };
  }

  onDateChange = dateRange => {
    const newData = sortDataByDate(this.state.data, 'recieve_date', dateRange);
    this.setState({
      filteredData: newData,
      dateRange: dateRange
    });
  };

  componentDidMount() {
    this.refreshTable();

    db.onceGetProviders().then(snapshot => {
      var data = snapshot.val();
      this.setState({ providers: data });
    });
  }

  readableProviderCell = rowData => {
    var hash = rowData.original['provider_id'];
    var obj = this.state.providers[hash];
    var name = obj ? obj['provider_id'] : 'INVALID PROVIDER_ID';
    return <span>{name}</span>;
  };

  refreshTable = () => {
    db.onceGetReceipts().then(snapshot => {
      var data = Object.values(snapshot.val());
      this.setState({ data: data });
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <div>
          <RangePicker onChange={this.onDateChange} format={'MM/DD/YYYY'} />
        </div>
        <AddFundsSource />
        <Button
          type="primary"
          onClick={() =>
            this.setState({
              formModalVisible: true,
              rowData: null
            })
          }
        >
          Add New Receipt
        </Button>

        <ReceiptForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />

        {!this.state.data || !this.state.providers ? (
          <LoadingScreen />
        ) : (
          <ReactTable
            getTrProps={(state, rowInfo) => ({
              onClick: () =>
                this.setState({
                  rowData: rowInfo.original,
                  formModalVisible: true
                })
            })}
            data={
              this.state.filteredData && this.state.dateRange.length
                ? this.state.filteredData
                : this.state.data
            }
            columns={keys.map(string => {
              if (string === 'provider_id') {
                return {
                  ...getTableColumnObjForFilterableHashes(string, this.state.providers),
                  Cell: this.readableProviderCell
                };
              }
              if (string === 'payment_source') {
                return getTableColumnObjForFilterableStrings(string);
              }
              if (string === 'billed_amt') {
                return getTableColumnObjForIntegers(string);
              }
              if (string === 'recieve_date') {
                return getTableColumnObjForDates(string);
              } else {
                return getTableColumnObjBasic(string);
              }
            })}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        )}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Receipts);
