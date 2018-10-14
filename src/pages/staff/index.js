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
  "unique_id",
  "username",
  "last_name",
  "first_name",
  "address",
  "city",
  "zip",
  "phone1",
  "phone2",
  "email",
  "type",
  "status",
  "notes",
  "password",
]

class Staff extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount(){
    var database = firebase.database();
    var shipmentsRef = database.ref('0/persons')
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

export default Staff;
