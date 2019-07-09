/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import { Button, Icon } from 'antd';
import { DatePicker } from 'antd';
import { sortDataByDate } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import EditableShipmentTable from './EditableShipmentTable';
import { styles } from '../styles.js';

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
      customers: null,
      fundingSources: null
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

    db.onceGetFundingSources().then(snapshot => {
      this.setState({ fundingSources: snapshot.val() });
    });
  }

  refreshTable = (optCallback = () => {}) => {
    db.onceGetShipments(optCallback).then(snapshot => {
      let data = [];
      snapshot.forEach(child => {
        data.push(child.val());
      });
      this.setState({ data: data.reverse() });
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
        <div style={styles.controller}>
          <RangePicker onChange={this.onDateChange} format={'MM/DD/YYYY'} />

          <Button
            type="primary"
            style={styles.addNew}
            onClick={() =>
              this.setState({
                formModalVisible: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        <EditableShipmentTable
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          rowData={this.state.rowData}
          customers={this.state.customers}
          fundingSources={this.state.fundingSources}
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
