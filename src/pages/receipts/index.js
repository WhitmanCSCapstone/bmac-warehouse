/**
 *  A component
 */

import React from 'react';
import { Button, DatePicker, Icon } from 'antd';
import { sortDataByDate } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import EditableReceiptTable from './EditableReceiptTable';
import { styles } from '../styles.js';
const { RangePicker } = DatePicker;

class Receipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null
    };
  }

  onDateChange = dateRange => {
    const newData = sortDataByDate(this.props.receipts, 'recieve_date', dateRange);
    this.setState({
      filteredData: newData,
      dateRange: dateRange
    });
  };

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['receipts'], optCallback);
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

        <EditableReceiptTable
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          rowData={this.state.rowData}
          providers={this.props.providers}
          fundingSources={this.props.fundingSources}
          onRowClick={this.onRowClick}
          filteredData={this.state.filteredData}
          dateRange={this.state.dateRange}
          data={this.props.receipts}
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

export default withAuthorization(authCondition, adminOnly)(Receipts);
