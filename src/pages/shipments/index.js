/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import { Button } from 'antd';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';
import TableDropdown from '../../components/TableDropdown';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';
import ShipmentForm from '../../components/form/types/ShipmentForm';

const keys = tableKeys['shipments'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24
  },
};

const { RangePicker } = DatePicker;

class Shipments extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null,
      customers: null,
    }
  }

  onDateChange = (dateRange) => {
    var newData = []
    for (var i = 0; i < this.state.data.length; i++){
      var entry = this.state.data[i]
      var entryDate = Moment(entry['ship_date'], 'MM/DD/YYYY')
      if(entryDate >= dateRange[0] && entryDate <= dateRange[1]){
        newData.push(entry)
      }
    }
    this.setState({
      filteredData: newData,
      dateRange: dateRange,
    }, function () {console.log(this.state.dateRange)})
  }

  componentDidMount(){
    this.refreshTable()

    db.onceGetCustomers().then(snapshot => {
      var data = snapshot.val();
      this.setState({ customers: data });
    })
  }

  readableCustomerCell = (rowData) => {
    var hash = rowData.original['customer_id'];
    var obj = this.state.customers[hash];
    var name = obj ? obj['customer_id'] : 'INVALID CUSTOMER_ID';
    return <span>{name}</span>
  }

  refreshTable = () => {
    db.onceGetShipments().then(snapshot => {
      var data = Object.values(snapshot.val());
      this.setState({ data: data });
    });
  }

  render() {
    return(
      <div style={styles.container}>

        <div>
          <RangePicker
            onChange={this.onDateChange}
            format={'MM/DD/YYYY'}
          />
        </div>

        <Button type="primary"
                onClick={ () => this.setState({
                    formModalVisible: true,
                    rowData: null,
                }) }>
          Add New Shipment
        </Button>

        <ShipmentForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          onCancel={ () => this.setState({ formModalVisible: false }) }
          rowData={ this.state.rowData }
        />

        { !this.state.data || !this.state.customers ? <LoadingScreen/> :
          <ReactTable
            getTrProps={(state, rowInfo) => ({
                onClick: () => this.setState({
                  rowData: rowInfo.original,
                  formModalVisible: true,
                })
            })}
            data={this.state.filteredData && this.state.dateRange.length ?
                  this.state.filteredData : this.state.data}
            columns={keys.map(string => {
                if(string==='customer_id'){
                  return({
                    Header: "Customer",
                    accessor: string,
                    Cell: this.readableCustomerCell,
                    filterable: true,
                    filterAll: true,
                    filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, {keys: [obj => {
                        var customer = this.state.customers[obj.customer_id]
                        var name = 'INVALID CUSTOMER ID'
                        if(customer){
                          var name = customer.customer_id
                        }
                        return name;
                      }]}),
                  })
                }
                if(string === 'ship_date'){
                  return({
                    id: "ship_date",
                    Header: 'Ship Date',
                    accessor: d => Moment(d.ship_date).local().format("MM/DD/YYYY"),
                    sortMethod: (a, b) => {
                      a = new Date(a).getTime();
                      b = new Date(b).getTime();
                      return b > a ? 1 : -1;
                    }
                  })
                }
                else{
                  return({
                    Header: string.replace('_',' ').split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),
                    accessor: string,
                  })}
            })}
            SubComponent={row => {
                return <TableDropdown
                         row={row.original.ship_items}
                             index={this.state.data.indexOf(row.original)}
                />
            }}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        }

      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Shipments);
