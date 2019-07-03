/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import { Button, DatePicker } from 'antd';
import { sortDataByDate, sortObjsByDate } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import AddFundsSource from '../../components/AddFundsSource';
import EditableReceiptTable from './EditableReceiptTable';
import Moment from 'moment';

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

  refreshTable = (optCallback = () => {}) => {
    db.onceGetReceipts(optCallback).then(snapshot => {
      var data = Object.values(snapshot.val());
      sortObjsByDate(data, 'recieve_date');
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
          Add New Receipt
        </Button>

        <EditableReceiptTable
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={this.closeForm}
          rowData={this.state.rowData}
          providers={this.state.providers}
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

export default withAuthorization(authCondition, adminOnly)(Receipts);
