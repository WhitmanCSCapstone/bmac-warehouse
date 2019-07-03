/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import { Button } from 'antd';
import { DatePicker } from 'antd';
import { sortDataByDate } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import AddFundsSource from '../../components/AddFundsSource';
import EditableShipmentTable from './EditableShipmentTable';

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

  refreshTable = () => {
    db.onceGetShipments().then(snapshot => {
      var data = Object.values(snapshot.val());
      this.setState({ data: data });
    });
  };

  closeForm = () => {
    this.setState({ formModalVisible: false });
  };

  onRowClick = rowInfo => {
    this.setState({
      rowData: rowInfo.original,
      formModalVisible: true
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

        <EditableShipmentTable
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          rowData={this.state.rowData}
          customers={this.state.customers}
          onRowClick={this.onRowClick}
          filteredData={this.state.filteredData}
          dateRange={this.state.dateRange}
          data={this.state.data}
          defaultPageSize={10}
          showPagination={true}
        />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Shipments);
