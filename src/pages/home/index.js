import React from 'react';
import Moment from 'moment';
import { db } from '../../firebase';
import withAuthorization from '../../components/withAuthorization';
import { sortDataByDate } from '../../utils/misc';
import EditableShipmentTable from '../shipments/EditableShipmentTable';
import EditableReceiptTable from '../receipts/EditableReceiptTable';

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  },
  tableTitles: {
    color: '#595959'
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
      providers: null,

      fundingSources: null
    };
  }

  refreshShipmentTable = () => {
    db.onceGetShipments().then(snapshot => {
      let data = [];
      snapshot.forEach(child => {
        data.push(child.val());
      });
      data = sortDataByDate(data, 'ship_date', this.state.dateRange);
      this.setState({ shipData: data.reverse() });
    });
  };

  refreshReceiptTable = () => {
    db.onceGetReceipts().then(snapshot => {
      let data = [];
      snapshot.forEach(child => {
        data.push(child.val());
      });
      data = sortDataByDate(data, 'recieve_date', this.state.dateRange);
      this.setState({ receiptData: data.reverse() });
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

    db.onceGetFundingSources().then(snapshot => {
      let data = snapshot.val();
      this.setState({ fundingSources: data });
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <p>
          Welcome to <em>BMAC-Warehouse</em>! Today is {Moment().format('dddd MMMM Do, YYYY')}.
        </p>
        <h3 style={styles.tableTitles}>Last 10 days Shipments</h3>

        <EditableShipmentTable
          formModalVisible={this.state.shipFormModalVisible}
          refreshTable={this.refreshShipmentTable}
          closeForm={() => this.setState({ shipFormModalVisible: false })}
          rowData={this.state.shipRowData}
          customers={this.state.customers}
          fundingSources={this.state.fundingSources}
          onRowClick={this.onShipmentRowClick}
          filteredData={this.state.filteredShipData}
          dateRange={this.state.dateRange}
          data={this.state.shipData}
          defaultPageSize={this.state.shipData ? this.state.shipData.length : 0}
          showPagination={false}
        />

        <br />

        <h3 style={styles.tableTitles}>Last 10 days Receipts</h3>

        <EditableReceiptTable
          formModalVisible={this.state.receiptFormModalVisible}
          refreshTable={this.refreshReceiptTable}
          closeForm={() => this.setState({ receiptFormModalVisible: false })}
          rowData={this.state.receiptRowData}
          providers={this.state.providers}
          fundingSources={this.state.fundingSources}
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
