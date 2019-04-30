/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';
import ProductForm from '../../components/form/types/ProductForm';
import { Button } from 'antd';
import Moment from 'moment';

const keys = tableKeys['products'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
};

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      rowData: null,
      products: null,
      formModalVisible: false,
    };
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    db.onceGetProducts().then(snapshot => this.setState({ data: Object.values(snapshot.val()) }));
  };

  render() {
    return (
      <div style={styles.container}>
        <Button
          type="primary"
          onClick={() => this.setState({ formModalVisible: true, rowData: null })}
        >
          Add New Product
        </Button>

        <ProductForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />

        {!this.state.data ? (
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
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
              if (string === 'product_id') {
                return {
                  Header: 'Product',
                  accessor: string,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ['product_id'] }),
                  filterAll: true,
                  filterable:true,
                })}
              if(string === 'initial_date'){
                  return({
                    id: "initial_date",
                    Header: 'Initial Date',
                    accessor: d => {
                      if (d.initial_date === '') {
                        return null;
                      } else {
                        return Moment(d.initial_date).local().format('MM/DD/YYYY');
                      }
                    },
                    sortMethod: (a, b) => {
                      a = a === '' ? -Infinity : a
                      b = b === '' ? -Infinity : b
                      a = new Date(a).getTime();
                      b = new Date(b).getTime();
                      return b > a ? 1 : -1;
                    }})
              }
              if (string === 'initial_date') {
                return {
                  id: 'initial_date',
                  Header: 'Initial Date',
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
              } else if (string === 'unit_weight') {
                return {
                  Header: 'Unit Weight',
                  id: string,
                  accessor: d => (isNaN(Number(d.unit_weight)) ? 0 : Number(d.unit_weight)),
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

const adminOnly = true;

export default withAuthorization(authCondition, adminOnly)(Products);
