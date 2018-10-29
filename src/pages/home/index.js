/**
 *  A component
 */

import React from 'react';
import Moment from 'moment';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants';

const shipKeys = tableKeys['shipments'];
const receiptKeys = tableKeys['receipts']

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      shipData: null,
      receiptsData: null,
      receiptsData: null,
    }
  }

  componentDidMount(){
    var database = firebase.database();

    var shipmentsRef = database.ref('2/shipments')
    shipmentsRef.on('value', (snapshot) => {
      var ship = snapshot.val()
      var filteredShip = []
      for (var i = 0; i < ship.length; i++){
        var entry = ship[i]
        var entryDate = Moment(entry['ship_date'], 'YY-MM-DD:HH:mm')
        if(entryDate >= Moment().add(-10, 'days') && entryDate <= Moment()){
          filteredShip.push(entry)
        }
      }
      this.setState({
        shipData: filteredShip
      })
    });;

    var receiptsRef = database.ref('6/contributions')
    receiptsRef.on('value', (snapshot) => {
      var receipts = snapshot.val()
      var filteredReceipts = []
      for (var i = 0; i < receipts.length; i++){
        var entry = receipts[i]
        var entryDate = Moment(entry['recieve_date'], 'YY-MM-DD:HH:mm')
        if(entryDate >= Moment().add(-10, 'days') && entryDate <= Moment()){
          filteredReceipts.push(entry)
        }
      }
      this.setState({
        receiptsData: filteredReceipts
      })
    });;
  }

  render() {
    return(
      <div style={styles.container}>
        <p>Welcome to <em>BMAC-Warehouse</em>! Today is {Moment().format('dddd MMMM Do YYYY')}</p>
        <strong>Last 10 days Shipments</strong>

        { !this.state.shipData ? <LoadingScreen/> :
          <ReactTable
            data={this.state.shipData ? this.state.shipData : []}
            columns={shipKeys.map(string => {
                return({
                  Header: string,
                  accessor: string,
                })
            })}
            defaultPageSize={this.state.shipData.length}
            className="-striped -highlight"
            showPagination={false}
          />
        }

        <strong>Last 10 days Receipts</strong>

        { !this.state.receiptsData ? <LoadingScreen/> :
          <ReactTable
            data={this.state.receiptsData ? this.state.receiptsData : []}
            columns={receiptKeys.map(string => {
                return({
                  Header: string,
                  accessor: string,
                })
            })}
            defaultPageSize={this.state.receiptsData.length}
            className="-striped -highlight"
            showPagination={false}
          />
        }

      </div>
    );
  }
}

export default Home;
