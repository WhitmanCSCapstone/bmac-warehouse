import React from 'react';
import Moment from 'moment';
import { db } from '../../firebase';
import withAuthorization from '../../components/withAuthorization';
import { sortDataByDate, sortObjsByDate } from '../../utils/misc';
import EditableShipmentTable from '../shipments/EditableShipmentTable';
import EditableReceiptTable from '../receipts/EditableReceiptTable';

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  }
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRange: [Moment().add(-10, 'days'), Moment().add(1000, 'days')],
      shipData: null,
      filteredShipData: null,
      shipFormModalVisible: false,
      shipRowData: null,
      customers: null,

      receiptsData: null,
      filteredReceiptData: null,
      receiptFormModalVisible: false,
      receiptRowData: null,
      providers: null
    };
  }

  refreshShipmentTable = () => {
    db.onceGetShipments().then(snapshot => {
      let data = Object.values(snapshot.val());
      data = sortDataByDate(data, 'ship_date', this.state.dateRange);
      sortObjsByDate(data, 'ship_date');
      this.setState({ shipData: data });
    });
  };

  refreshReceiptTable = () => {
    db.onceGetReceipts().then(snapshot => {
      let data = Object.values(snapshot.val());
      data = sortDataByDate(data, 'recieve_date', this.state.dateRange);
      sortObjsByDate(data, 'recieve_date');
      this.setState({ receiptData: data });
    });
  };

  onShipmentRowClick = rowInfo => {
    this.setState({
      shipRowData: rowInfo.original,
      shipFormModalVisible: true
    });
  };

  onReceiptRowClick = rowInfo => {
    this.setState({
      receiptRowData: rowInfo.original,
      receiptFormModalVisible: true
    });
  };

  componentDidMount() {
    this.refreshShipmentTable();
    this.refreshReceiptTable();

    db.onceGetCustomers().then(snapshot => {
      var data = snapshot.val();
      this.setState({ customers: data });
    });

    db.onceGetProviders().then(snapshot => {
      var data = snapshot.val();
      this.setState({ providers: data });
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <p>
          Welcome to <em>BMAC-Warehouse</em>! Today is {Moment().format('dddd MMMM Do, YYYY')}.
        </p>
        <h3>Last 10 days Shipments</h3>

        <EditableShipmentTable
          formModalVisible={this.state.shipFormModalVisible}
          refreshTable={this.refreshShipmentTable}
          closeForm={() => this.setState({ shipFormModalVisible: false })}
          rowData={this.state.shipRowData}
          customers={this.state.customers}
          onRowClick={this.onShipmentRowClick}
          filteredData={this.state.filteredShipData}
          dateRange={this.state.dateRange}
          data={this.state.shipData}
          defaultPageSize={this.state.shipData ? this.state.shipData.length : 0}
          showPagination={false}
        />

        <br />

        <h3>Last 10 days Receipts</h3>

        <EditableReceiptTable
          formModalVisible={this.state.receiptFormModalVisible}
          refreshTable={this.refreshReceiptTable}
          closeForm={() => this.setState({ receiptFormModalVisible: false })}
          rowData={this.state.receiptRowData}
          providers={this.state.providers}
          onRowClick={this.onReceiptRowClick}
          filteredData={this.state.filteredReceiptData}
          dateRange={this.state.dateRange}
          data={this.state.receiptData}
          defaultPageSize={this.state.receiptData ? this.state.receiptData.length : 0}
          showPagination={false}
        />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Home);
