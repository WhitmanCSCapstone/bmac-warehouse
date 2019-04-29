/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import { DatePicker, Button } from 'antd';
import Moment from 'moment';
import matchSorter from 'match-sorter';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import ShipmentForm from '../../components/form/types/ShipmentForm';
import { db } from '../../firebase';

const keys = tableKeys.shipments;

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
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
      customers: null,
    };
  }

  componentDidMount() {
    this.refreshTable();
    db.onceGetCustomers().then((snapshot) => {
      const data = snapshot.val();
      this.setState({ customers: data });
    });
  }

  onDateChange = (dateRange) => {
    const newData = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const entry = this.state.data[i];
      const entryDate = Moment(entry.ship_date, 'MM/DD/YYYY');
      if (entryDate >= dateRange[0] && entryDate <= dateRange[1]) {
        newData.push(entry);
      }
    }
    this.setState({
      filteredData: newData,
      dateRange,
    });
  }


  readableCustomerCell = (rowData) => {
    const hash = rowData.original.customer_id;
    const obj = this.state.customers[hash];
    const name = obj ? obj.customer_id : 'INVALID CUSTOMER_ID';
    return <span>{name}</span>;
  }

  refreshTable = () => {
    db.onceGetShipments().then((snapshot) => {
      const data = Object.values(snapshot.val());
      this.setState({ data });
    });
  }

  render() {
    return (
      <div style={styles.container}>

        <div>
          <RangePicker
            onChange={this.onDateChange}
            format="MM/DD/YYYY"
          />
        </div>

        <Button
          type="primary"
          onClick={() => this
            .setState({
              formModalVisible: true,
              rowData: null,
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

        { !this.state.data || !this.state.customers
          ? (
            <LoadingScreen />
          ) : (
            <ReactTable
              getTrProps={(state, rowInfo) => (
                {
                  onClick: () => this.setState({
                    rowData: rowInfo.original,
                    formModalVisible: true,
                  }),
                }
              )}
              data={this.state.filteredData && this.state.dateRange.length
                ? this.state.filteredData : this.state.data}
              columns={
                keys.map((string) => {
                  if (string === 'customer_id') {
                    return ({
                      Header: string
                        .replace('_', ' ')
                        .split(' ')
                        .map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
                      accessor: string,
                      Cell: this.readableCustomerCell,
                      filterable: true,
                      filterAll: true,
                      filterMethod: (filter, rows) => matchSorter(rows, filter.value, {
                        keys: [(obj) => {
                          const customer = this.state.customers[obj.customer_id];
                          let name = 'INVALID CUSTOMER ID';
                          if (customer) {
                            name = customer.customer_id;
                          }
                          return name;
                        }],
                      }),
                    });
                  }
                  if (string === 'ship_date') {
                    return ({
                      id: 'ship_date',
                      Header: 'Ship Date',
                      accessor: d => Moment(d.ship_date).local().format('MM/DD/YYYY'),
                      sortMethod: (a, b) => {
                        const aTime = new Date(a).getTime();
                        const bTime = new Date(b).getTime();
                        return bTime > aTime ? 1 : -1;
                      },
                    });
                  }
                  return ({
                    Header: string
                      .replace('_', ' ').split(' ')
                      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' '),
                    accessor: string,
                  });
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
