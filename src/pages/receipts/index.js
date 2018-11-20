/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { DatePicker } from 'antd';
import Moment from 'moment';
import TableDropdown from '../../components/TableDropdown';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';

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
    db.onceGetReceipts().then(snapshot =>
      this.setState({ data: snapshot.val() })
    );
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
              if(string === 'provider_id'){
                return({
                  Header: string,
                  accessor: string,
                  filterable: true,
                  filterAll: true,
                  filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['provider_id'] }),
                })
              }
              else{
                return({
                  Header: string,
                  accessor: string,
                })}
            })}
            SubComponent={row => {
              return <TableDropdown
                row={row.original.receive_items}
                index={this.state.data.indexOf(row.original)}
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

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Receipts);
