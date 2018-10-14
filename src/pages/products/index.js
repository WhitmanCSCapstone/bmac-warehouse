/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

const keys = [
  "product_id",
  "product_code",
  "funding_source",
  "unit_weight",
  "unit_price",
  "initial_date",
  "initial_stock",
  "minimum_stock",
  "history",
  "current_stock",
  "inventory_date",
  "status",
  "notes"
];

class Products extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount(){
    var database = firebase.database();
    var shipmentsRef = database.ref('5/products')
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
        { !this.state.data ? <LoadingScreen/> :
          <ReactTable
            data={this.state.data ? this.state.data : []}
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

export default Products;
