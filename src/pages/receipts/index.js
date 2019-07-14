/**
 *  A component
 */

import React from 'react';
import { Button, Icon } from 'antd';
import CustomDatePicker from '../../components/CustomDatePicker';
import { sortDataByDate } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import EditableReceiptTable from './EditableReceiptTable';
import { styles } from '../styles.js';

class Receipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: null,
      dateRange: null,
      modalVisible: false,
      shouldFormBeMounted: false,
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
    this.setState({ shouldFormBeMounted: false });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  onRowClick = rowInfo => {
    this.setState({
      rowData: rowInfo.original,
      modalVisible: true,
      shouldFormBeMounted: true
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.controller}>
          <CustomDatePicker onDateChange={this.onDateChange} value={this.state.dateRange} />

          <Button
            type="primary"
            style={styles.addNew}
            onClick={() =>
              this.setState({
                modalVisible: true,
                shouldFormBeMounted: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        <EditableReceiptTable
          modalVisible={this.state.modalVisible}
          shouldFormBeMounted={this.state.shouldFormBeMounted}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          closeModal={this.closeModal}
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
