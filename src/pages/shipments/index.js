/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import { Button } from 'antd';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import { tableKeys } from '../../constants/constants';
import {
  sortDataByDate,
  getTableColumnObjForDates,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableStrings,
  getTableColumnObjForFilterableHashes
} from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ShipmentForm from '../../components/form/types/ShipmentForm';
import AddFundsSource from '../../components/AddFundsSource';

const keys = tableKeys['shipments'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  }
};

const { RangePicker } = DatePicker;

class Shipments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null,
      customers: null
    };
  }

  onDateChange = dateRange => {
    const newData = sortDataByDate(this.state.data, 'ship_date', dateRange);
    this.setState({
      filteredData: newData,
      dateRange: dateRange
    });
  };

  componentDidMount() {
    this.refreshTable();

    db.onceGetCustomers().then(snapshot => {
      var data = snapshot.val();
      this.setState({ customers: data });
    });
  }

  readableCustomerCell = rowData => {
    var hash = rowData.original['customer_id'];
    var obj = this.state.customers[hash];
    var name = obj ? obj['customer_id'] : 'INVALID CUSTOMER_ID';
    return <span>{name}</span>;
  };

  refreshTable = () => {
    db.onceGetShipments().then(snapshot => {
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
          Add New Shipment
        </Button>

        <ShipmentForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />

        {!this.state.data || !this.state.customers ? (
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
              if (string === 'customer_id') {
                return {
                  ...getTableColumnObjForFilterableHashes(string, this.state.customers),
                  Cell: this.readableCustomerCell
                };
              }
              if (string === 'funds_source') {
                return getTableColumnObjForFilterableStrings(string);
              }
              if (string === 'ship_date') {
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

export default withAuthorization(authCondition, adminOnly)(Shipments);
