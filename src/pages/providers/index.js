/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import { getTableColumnObjBasic, getTableColumnObjForFilterableStrings } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ProviderForm from '../../components/form/types/ProviderForm';
import { Button, Icon } from 'antd';
import { styles } from '../styles.js';

const keys = tableKeys['providers'];

class Providers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: null,
      modalVisible: false,
      shouldFormBeMounted: false,
      rowData: null
    };
  }

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['providers'], optCallback);
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
                modalVisible: true,
                shouldFormBeMounted: true,
                rowData: null
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        {!this.state.shouldFormBeMounted ? null : (
          <ProviderForm
            closeModal={() => {
              this.setState({ modalVisible: false });
            }}
            modalVisible={this.state.modalVisible}
            refreshTable={this.refreshTable}
            closeForm={() => this.setState({ shouldFormBeMounted: false })}
            rowData={this.state.rowData}
          />
        )}

        {!this.props.providers ? (
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
            data={this.props.providers ? Object.values(this.props.providers) : []}
            columns={keys.map(string => {
              if (string === 'provider_id') {
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

export default withAuthorization(authCondition, adminOnly)(Providers);
