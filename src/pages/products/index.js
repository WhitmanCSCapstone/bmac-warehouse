/**
 *  A component
 */

import React from 'react';
import firebase from '../../firebase.js';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants';

const keys = tableKeys['products'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

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
