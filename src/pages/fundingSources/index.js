/**
 *  A component
 */

import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import { getTableColumnObjBasic } from '../../utils/misc.js';
import withAuthorization from '../../components/withAuthorization';
import FundingSourceForm from '../../components/form/types/FundingSourceForm';
import { Button, Icon } from 'antd';
import { styles } from '../styles.js';

const keys = tableKeys['fundingSources'];

class FundingSources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: null,
      formModalVisible: false
    };
  }

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['fundingSources'], optCallback);
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

        <FundingSourceForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />

        {!this.props.fundingSources ? (
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
            data={this.props.fundingSources ? Object.values(this.props.fundingSources) : []}
            columns={keys.map(string => getTableColumnObjBasic(string))}
            className="-striped -highlight"
            defaultPageSize={Object.values(this.props.fundingSources).length}
            showPagination={false}
          />
        )}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = true;

export default withAuthorization(authCondition, adminOnly)(FundingSources);
