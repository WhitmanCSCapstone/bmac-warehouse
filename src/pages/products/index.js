/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import {
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableStrings,
  getTableColumnObjForFilterableHashes,
  readableFundingSourceCell
} from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ProductForm from '../../components/form/types/ProductForm';
import { Button, Icon } from 'antd';
import { styles } from '../styles.js';

const keys = tableKeys['products'];

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: null,
      formModalVisible: false
    };
  }

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['products'], optCallback);
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.controller}>
          <Button
            type="primary"
            style={styles.addNew}
            onClick={() =>
              this.setState({
                formModalVisible: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        <ProductForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
          fundingSources={this.props.fundingSources}
        />

        {!this.props.products ? (
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
            data={this.props.products ? Object.values(this.props.products) : []}
            columns={keys.map(string => {
              if (string === 'product_id') {
                return getTableColumnObjForFilterableStrings(string);
              }
              if (string === 'initial_date') {
                return getTableColumnObjForDates(string);
              }
              if (string === 'funding_source') {
                return {
                  ...getTableColumnObjForFilterableHashes(
                    string,
                    this.props.fundingSources,
                    true,
                    'id'
                  ),
                  Cell: rowData =>
                    readableFundingSourceCell(rowData, this.props.fundingSources, 'funding_source')
                };
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
