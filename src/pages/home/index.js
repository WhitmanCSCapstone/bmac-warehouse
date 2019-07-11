import React from 'react';
import Moment from 'moment';
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
    const dateRange = [Moment().add(-10, 'days'), Moment().add(1000, 'days')];
    this.state = {
      dateRange: dateRange,
      shipData: props.shipments,
      filteredShipData: sortDataByDate(props.shipments, 'ship_date', dateRange),
      shipFormModalVisible: false,
      shipRowData: null,
      receiptsData: props.receipts,
      filteredReceiptData: sortDataByDate(props.receipts, 'recieve_date', dateRange),
      receiptFormModalVisible: false,
      receiptRowData: null
    };
  }

  refreshShipmentTable = (optCallback = () => {}) => {
    this.props.refreshTables(['shipments'], optCallback);
  };

  refreshReceiptTable = (optCallback = () => {}) => {
    this.props.refreshTables(['receipts'], optCallback);
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

  componentDidUpdate(prevProps) {
    if (this.props.shipments !== prevProps.shipments) {
      this.setState({
        filteredShipData: sortDataByDate(this.props.shipments, 'ship_date', this.state.dateRange)
      });
    }
    if (this.props.receipts !== prevProps.receipts) {
      this.setState({
        filteredReceiptData: sortDataByDate(
          this.props.receipts,
          'recieve_date',
          this.state.dateRange
        )
      });
    }
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
          customers={this.props.customers}
          fundingSources={this.props.fundingSources}
          onRowClick={this.onShipmentRowClick}
          filteredData={this.state.filteredShipData}
          dateRange={this.state.dateRange}
          data={this.state.shipData}
          defaultPageSize={this.state.filteredShipData ? this.state.filteredShipData.length : 0}
          showPagination={false}
          products={this.props.products}
        />

        <br />

        <h3 style={styles.tableTitles}>Last 10 days Receipts</h3>

        <EditableReceiptTable
          formModalVisible={this.state.receiptFormModalVisible}
          refreshTable={this.refreshReceiptTable}
          closeForm={() => this.setState({ receiptFormModalVisible: false })}
          rowData={this.state.receiptRowData}
          providers={this.props.providers}
          fundingSources={this.props.fundingSources}
          onRowClick={this.onReceiptRowClick}
          filteredData={this.state.filteredReceiptData}
          dateRange={this.state.dateRange}
          data={this.props.receipts}
          defaultPageSize={
            this.state.filteredReceiptData ? this.state.filteredReceiptData.length : 0
          }
          showPagination={false}
          products={this.props.products}
        />
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Home);
