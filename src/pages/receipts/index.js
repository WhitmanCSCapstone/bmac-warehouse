/**
 *  A component
 */

import React from 'react';
import { getReadableReceiptsTableData } from '../../utils/receipts';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { Button, DatePicker } from 'antd';
import Moment from 'moment';
import TableDropdown from '../../components/TableDropdown';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';
import ReceiptForm from '../../components/form/types/ReceiptForm';

const keys = tableKeys['receipts'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24,

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
      formModalVisible: false,
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
    this.refreshTable()
  }

  refreshTable = () => {
    getReadableReceiptsTableData().then(data =>
      this.setState({ data: data.val() })
    );
  }

  render() {
    return(
      <div style={styles.container}>

        <div>
          <RangePicker onChange={this.onDateChange} />
        </div>

        <Button type="primary"
                onClick={ () => this.setState({ formModalVisible: true }) }>
          Add New Receipt
        </Button>

        <ReceiptForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          onCancel={ () => this.setState({ formModalVisible: false }) }
        />

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
