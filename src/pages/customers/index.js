/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import { getTableColumnObjBasic, getTableColumnObjForFilterableStrings } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import { Button, Icon } from 'antd';
import CustomerForm from '../../components/form/types/CustomerForm';
import { styles } from '../styles.js';

const keys = tableKeys['customers'];

class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldFormBeMounted: false,
      modalVisible: false,
      rowData: null
    };
  }

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['customers'], optCallback);
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
                shouldFormBeMounted: true,
                modalVisible: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        {!this.state.shouldFormBeMounted ? null : (
          <CustomerForm
            closeModal={() => {
              this.setState({ modalVisible: false });
            }}
            refreshTable={this.refreshTable}
            modalVisible={this.state.modalVisible}
            closeForm={() => this.setState({ shouldFormBeMounted: false })}
            rowData={this.state.rowData}
          />
        )}

        {!this.props.customers ? (
          <LoadingScreen />
        ) : (
          <ReactTable
            getTrProps={(state, rowInfo) => ({
              onClick: () =>
                this.setState({
                  rowData: rowInfo.original,
                  shouldFormBeMounted: true,
                  modalVisible: true
                })
            })}
            data={this.props.customers ? Object.values(this.props.customers) : []}
            columns={keys.map(string => {
              if (string === 'customer_id') {
                return getTableColumnObjForFilterableStrings(string);
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

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Customers);
