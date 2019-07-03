/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import {
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableStrings
} from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ProductForm from '../../components/form/types/ProductForm';
import { Button } from 'antd';
import AddFundsSource from '../../components/AddFundsSource';

const keys = tableKeys['products'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  }
};

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      rowData: null,
      products: null,
      formModalVisible: false
    };
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = (optCallback = () => {}) => {
    db.onceGetProducts(optCallback).then(snapshot =>
      this.setState({ data: Object.values(snapshot.val()) })
    );
  };

  render() {
    return (
      <div style={styles.container}>
        <AddFundsSource />
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
                  formModalVisible: true
                })
            })}
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
              if (string === 'product_id') {
                return getTableColumnObjForFilterableStrings(string);
              }
              if (string === 'initial_date') {
                return getTableColumnObjForDates(string);
              }
              if (string === 'funding_source') {
                return getTableColumnObjForFilterableStrings(string);
              }
              if (string === 'unit_weight') {
                return getTableColumnObjForIntegers(string);
              } else {
                return getTableColumnObjBasic(string);
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
