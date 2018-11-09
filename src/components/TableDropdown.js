import React from 'react';
import firebase from '../firebase.js';
import ReactTable from 'react-table';
import EditableTable from 'react-table';\

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

var ref = null;
var originalData = null;

class TableDropdown extends React.Component {
  constructor(props){
    super(props);
    ref = firebase.database().ref('2/shipments/' + props.index + '/ship_items/');
    /*ref.on("value", function(snapshot) {
       console.log(snapshot.val());
       })*/
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

  onEdit = () => {
    originalData = this.state.data
    this.setState({editable: !this.state.editable})
  };

  onSave = () => {
    //do firebase thing
    this.setState({editable: !this.state.editable})
    ref.set(this.state.data)
  }

  onCancel = () => {
    this.setState({data: originalData})
    this.setState({editable: !this.state.editable})
  }

  render() {
    var renderEdit = null;
    var renderSave = null;

    if(this.state.editable) {
      renderEdit = <div>
        <button onClick = {this.onCancel}>
          Cancel
        </button>
      </div>
      renderSave = <div>
        <button onClick = {this.onSave}>
          Save
        </button>
      </div>
    }
    else {
      renderEdit = <div>
        <button onClick = {this.onEdit}>
          Edit
        </button>
      </div>
    }

    return(
      <div style={styles.container}>
        {this.getTable()}
        {renderEdit}
        {renderSave}
      </div>
    );
  }
}

export default TableDropdown;
