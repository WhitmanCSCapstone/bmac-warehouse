/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { Button, DatePicker } from 'antd';
import Moment from 'moment';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';
import ReceiptForm from '../../components/form/types/ReceiptForm';

const keys = tableKeys['receipts'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
};

const { RangePicker } = DatePicker;

class Receipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null,
      providers: null,
    };
  }

  onDateChange = dateRange => {
    var newData = [];
    for (var i = 0; i < this.state.data.length; i++) {
      var entry = this.state.data[i];
      var entryDate = Moment(entry['recieve_date'], 'MM/DD/YYYY');
      if (entryDate >= dateRange[0] && entryDate <= dateRange[1]) {
        newData.push(entry);
      }
    }
    this.setState(
      {
        filteredData: newData,
        dateRange: dateRange,
      },
      function() {
        console.log(this.state.dateRange);
      }
    );
  };

  componentDidMount() {
    this.refreshTable();

    db.onceGetProviders().then(snapshot => {
      var data = snapshot.val();
      this.setState({ providers: data });
    });
  }

  readableProviderCell = rowData => {
    var hash = rowData.original['provider_id'];
    var obj = this.state.providers[hash];
    var name = obj ? obj['provider_id'] : 'INVALID PROVIDER_ID';
    return <span>{name}</span>;
  };

  refreshTable = () => {
    db.onceGetReceipts().then(snapshot => {
      var data = Object.values(snapshot.val());
      this.setState({ data: data });
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <div>
          <RangePicker onChange={this.onDateChange} format={'MM/DD/YYYY'} />
        </div>

        <Button
          type="primary"
          onClick={() =>
            this.setState({
              formModalVisible: true,
              rowData: null,
            })
          }
        >
          Add New Receipt
        </Button>

        <ReceiptForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />

        {!this.state.data || !this.state.providers ? (
          <LoadingScreen />
        ) : (
          <ReactTable
            getTrProps={(state, rowInfo) => ({
              onClick: () =>
                this.setState({
                  rowData: rowInfo.original,
                  formModalVisible: true,
                }),
            })}
            data={
              this.state.filteredData && this.state.dateRange.length
                ? this.state.filteredData
                : this.state.data
            }
            columns={keys.map(string => {
              if (string === 'provider_id') {
                return {
                  Header: string
                    .replace('_', ' ')
                    .split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),
                  accessor: string,
                  Cell: this.readableProviderCell,
                  filterable: true,
                  filterAll: true,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, {
                      keys: [
                        obj => {
                          var provider = this.state.providers[obj.provider_id];
                          var name = 'INVALID PROVIDER ID';
                          if (provider) {
                            name = provider.provider_id;
                          }
                          return name;
                        },
                      ],
                    }),
                };
              }
              if (string === 'recieve_date') {
                return {
                  id: 'recieve_date',
                  Header: 'Receive Date',
                  accessor: d =>
                    Moment(d.initial_date)
                      .local()
                      .format('MM/DD/YYYY'),
                  sortMethod: (a, b) => {
                    a = new Date(a).getTime();
                    b = new Date(b).getTime();
                    return b > a ? 1 : -1;
                  },
                };
              } else {
                return {
                  Header: string
                    .replace('_', ' ')
                    .split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),
                  accessor: string,
                };
              }
            })}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        )}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Receipts);
