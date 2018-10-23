/**
 *  A component
 */

import React from 'react';
import firebase from '../firebase.js';
import ReactTable from 'react-table';
import EditableTable from 'react-table';


const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px"
  },
};

const keys = [
  "product",
  "caselots",
  "totalweight",
];

const stubData = [
  {
    product: "a",
    caselots: "b",
    totalweight: "c",

  },

  {
    product: "food",
    caselots: "many",
    totalweight: "a dozen",
  },
];

class TableDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: stubData,
      editable: false,
    }
  }

  getTable = () => {
    return (
      <ReactTable
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
                return({
                  Header: string,
                  accessor: string,
                })
            })}
            showPagination={false}
            defaultPageSize={this.state.data.length}
            className="-striped -highlight"
          />
    )
  };

  click = () => {
    this.setState({editable: true})
  };

  render() {
    return(
      <div style={styles.container}>

        {this.state.editable ? this.getTable() : "editable"}

        <button onClick = {this.click}>
          edit
        </button>

      </div>
    );
  }
}

export default TableDropdown;
