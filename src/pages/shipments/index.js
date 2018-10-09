/**
 *  A component
 */

import React from 'react';
<<<<<<< HEAD
import { db } from '../../firebase';
=======
import firebase from '../../firebase.js';
import { Form, Icon, Input, Button } from 'antd';
>>>>>>> Added forms page and appended it to shipments
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { tableKeys } from '../../constants';
>>>>>>> Added forms page and appended it to shipments
import TableDropdown from '../../components/TableDropdown';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import { getReadableShipmentsTableData } from '../../utils/shipments';
import matchSorter from 'match-sorter';

const keys = tableKeys['shipments'];
=======
import Forms from '../../pages/form';
<<<<<<< HEAD
>>>>>>> aa7286b... made changes to form and shipments page

=======
import Forms from '../form';  
=======
>>>>>>> 377bca0... commit

>>>>>>> 5f83b3f... Remade basic changes to the form and shipments pages

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

class Shipments extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
    }
  }

  onDateChange = (dateRange) => {
    var newData = []
    for (var i = 0; i < this.state.data.length; i++){
      var entry = this.state.data[i]
      var entryDate = Moment(entry['ship_date'], 'YY-MM-DD:HH:mm')
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
    getReadableShipmentsTableData().then(data =>
      this.setState({ data: data.val() })
    );
  }

  render() {
    return(
      <div style={styles.container}>
<<<<<<< HEAD
<<<<<<< HEAD

      <Forms/>

        <div>
          <RangePicker onChange={this.onDateChange} />
        </div>

<<<<<<< HEAD
=======
      <Forms/>
      hello
>>>>>>> 5f83b3f... Remade basic changes to the form and shipments pages
=======
        <Forms/>
>>>>>>> 9646359... Form page changes
        { !this.state.data ? <LoadingScreen/> :
=======
        { !this.state.data.length ? <LoadingScreen/> :
>>>>>>> 377bca0... commit
          <ReactTable
            data={this.state.filteredData && this.state.dateRange.length ?
                  this.state.filteredData : this.state.data}
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
