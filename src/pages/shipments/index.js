/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import firebase from '../../firebase.js';
import { Form, Icon, Input, Button } from 'antd';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';
import { tableKeys } from '../../constants';
import TableDropdown from '../../components/TableDropdown';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import { getReadableShipmentsTableData } from '../../utils/shipments';
import matchSorter from 'match-sorter';

const keys = tableKeys['shipments'];

const formItem = Form.Item;
const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24
  },
};

const { RangePicker } = DatePicker;

const keys = [
  "customer_id",
  "funds_source",
  "ship_date",
  "ship_via",
  "ship_rate",
  "total_weight",
  "total_price",
  "invoice_date",
  "invoice_no",
  "notes"
];

class Shipments extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      filteredData: [],
    }
  }

  onDateChange = (dateRange) => {
    var newData = []
    for (var i = 0; i < this.state.data.length; i++){
      var entry = this.state.data[i]
      var entryDate = Moment(entry['ship_date'], 'YY-MM-DD:HH:mm')
      if(entryDate >= dateRange[0] && entryDate >= dateRange[0]){
        newData.push(entry)
      }
    }
    this.setState({
      filteredData: newData,
    })
  }

  componentDidMount(){
    getReadableShipmentsTableData().then(data =>
      this.setState({ data: data.val() })
    );
  }

  render() {
    return(
      <div style={styles.container}>

        <div>
          <RangePicker onChange={this.onDateChange} />
        </div>

        { !this.state.data.length ? <LoadingScreen/> :
          <ReactTable
            data={this.state.filteredData.length ? this.state.filteredData : this.state.data}
            columns={keys.map(string => {
              if(string==='customer_id'){
                return({
                  Header: "Customer",
                  accessor: string,
                  filterable: true,
                  filterAll: true,
                  filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['customer_id'] }),
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
