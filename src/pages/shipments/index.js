/**
 *  A component
 */

import React from 'react';
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
      filteredData: null,
      dateRange: null,
      modalVisible: false,
      formShouldBeMounted: false,
      rowData: null
    };
  }

  onDateChange = dateRange => {
    const newData = sortDataByDate(this.props.data, 'ship_date', dateRange);
    this.setState({
      filteredData: newData,
      dateRange: dateRange
    });
  };

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['shipments'], optCallback);
  };

  closeForm = () => {
    this.setState({ formShouldBeMounted: false });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  onRowClick = rowInfo => {
    this.setState({
      rowData: rowInfo.original,
      modalVisible: true,
      formShouldBeMounted: true
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
                modalVisible: true,
                formShouldBeMounted: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        <EditableShipmentTable
          modalVisible={this.state.modalVisible}
          formShouldBeMounted={this.state.formShouldBeMounted}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          closeModal={this.closeModal}
          rowData={this.state.rowData}
          customers={this.props.customers}
          fundingSources={this.props.fundingSources}
          onRowClick={this.onRowClick}
          filteredData={this.state.filteredData}
          dateRange={this.state.dateRange}
          data={this.props.shipments}
          defaultPageSize={10}
          showPagination={true}
          products={this.props.products}
        />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Shipments);
