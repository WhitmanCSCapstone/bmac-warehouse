/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';
import { tableKeys } from '../../constants';
import TableDropdown from '../../components/TableDropdown';

const keys = tableKeys['receipts'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

const { RangePicker } = DatePicker;

class Receipts extends React.Component {
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
      var entryDate = Moment(entry['recieve_date'], 'YY-MM-DD:HH:mm')
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
    var database = firebase.database();
    var receiptsRef = database.ref('6/contributions')
    receiptsRef.on('value', (snapshot) => {
      var receipts = snapshot.val()
      this.setState({
        data: receipts
      })
    });;
  }

  render() {
    return(
      <div style={styles.container}>

        <div>
          <RangePicker onChange={this.onDateChange} />
        </div>

        { !this.state.data ? <LoadingScreen/> :
          <ReactTable
            data={this.state.filteredData && this.state.dateRange.length ?
                  this.state.filteredData : this.state.data}
            columns={keys.map(string => {
                return({
                  Header: string,
                  accessor: string,
                })
            })}
            SubComponent={row => {
              return <TableDropdown
                row={row.original.receive_items}
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

export default Receipts;
