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
      shouldFormBeMounted: false,
      modalVisible: false
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
          <FundingSourceForm
            closeModal={() => {
              this.setState({ modalVisible: false });
            }}
            refreshTable={this.refreshTable}
            modalVisible={this.state.modalVisible}
            closeForm={() => this.setState({ shouldFormBeMounted: false })}
            rowData={this.state.rowData}
          />
        )}

        {!this.props.fundingSources ? (
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
