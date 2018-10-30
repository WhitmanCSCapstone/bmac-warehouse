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
  "case_lots",
  "total_weight",
];

class TableDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: props.row,
      editable: false,
    }
    this.renderEditable = this.renderEditable.bind(this);
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  getTable = () => {
        return (
          <ReactTable
              data={this.state.data ? this.state.data : []}
              columns={keys.map(string => {
                if(this.state.editable) {
                  return({
                    Header: string,
                    accessor: string,
                    Cell: this.renderEditable,
                  })
                }

                else {
                  return({
                    Header: string,
                    accessor: string,
                  })
                }
              })}
              showPagination={false}
              defaultPageSize={this.state.data ? this.state.data.length : 0}
              className="-striped -highlight"
            />
          )
      };

  click = () => {
    this.setState({editable: !this.state.editable})
  };

  render() {
    return(
      <div style={styles.container}>
        {this.getTable()}
        <button onClick = {this.click}>
          Edit
        </button>
      </div>
    );
  }
}

export default TableDropdown;
