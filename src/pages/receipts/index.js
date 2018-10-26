/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

const { RangePicker } = DatePicker;

const keys = [
  "provider_id",
  "recieve_date",
  "payment_source",
  "billed_amt",
  "notes"
];

class Receipts extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      filteredData: null,
    }
  }

  onDateChange = (dateRange) => {
    var newData = []
    for (var i = 0; i < this.state.data.length; i++){
      var entry = this.state.data[i]
      var entryDate = Moment(entry['recieve_date'], 'YY-MM-DD:HH:mm')
      if(entryDate >= dateRange[0] && entryDate >= dateRange[0]){
        newData.push(entry)
      }
    }
    this.setState({
      filteredData: newData,
    })
  }

  componentDidMount(){
    var database = firebase.database();
    var shipmentsRef = database.ref('6/contributions')
    shipmentsRef.on('value', (snapshot) => {
      var ship = snapshot.val()
      this.setState({
        data: ship
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
            data={this.state.filteredData ? this.state.filteredData :
                  this.state.data ? this.state.data : []}
            columns={keys.map(string => {
                return({
                  Header: string,
                  accessor: string,
                })
            })}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        }

      </div>
    );
  }
}

export default Receipts;
