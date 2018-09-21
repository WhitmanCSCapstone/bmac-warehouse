/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';

const styles = {
  container: {
  },
};

class Shipments extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  displayShipments = () => {
    var database = firebase.database();
    var shipmentsRef = database.ref('shipments')
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
        This is the shipments page!

        <button onClick={()=>{this.displayShipments()}}>click me (and then wait 5 seconnds)</button>
        {this.state.data.map((obj) => {
           var cust = obj['Customer'];
           var prod = obj['Product'];
           var date = obj['Ship Date'];
           var weight = obj['Weight'];
           return <div>{cust} {prod} {date} {weight}</div>
        })}

      </div>
    );
  }
}

export default Shipments;
