/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import { getTableColumnObjBasic, getTableColumnObjForFilterableStrings } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import ProviderForm from '../../components/form/types/ProviderForm';
import { Button } from 'antd';

const keys = tableKeys['providers'];

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24
  }
};

class Providers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      formModalVisible: false,
      rowData: null
    };
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = (optCallback = () => {}) => {
    db.onceGetProviders(optCallback).then(snapshot =>
      this.setState({ data: Object.values(snapshot.val()) })
    );
  };

  render() {
    return (
      <div style={styles.container}>
        <Button
          type="primary"
          onClick={() => this.setState({ formModalVisible: true, rowData: null })}
        >
          Add New Provider
        </Button>

        <ProviderForm
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
