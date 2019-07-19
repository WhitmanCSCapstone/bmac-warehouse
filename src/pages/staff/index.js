import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import { Button, Icon } from 'antd';
import StaffForm from '../../components/form/types/StaffForm';
import { styles } from '../styles.js';

const keys = tableKeys['users'];

class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldFormBeMounted: false,
      modalVisible: false
    };
  }

  refreshTable = (optCallback = () => {}) => {
    this.props.refreshTables(['users'], optCallback);
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
                modalVisible: true
              })
            }
          >
            <Icon type="plus" />
          </Button>
        </div>

        {!this.state.shouldFormBeMounted ? null : (
          <StaffForm
            closeModal={() => {
              this.setState({ modalVisible: false });
            }}
            modalVisible={this.state.modalVisible}
            refreshTable={this.refreshTable}
            closeForm={() => this.setState({ shouldFormBeMounted: false })}
          />
        )}

        {!this.props.users ? (
          <LoadingScreen />
        ) : (
          <ReactTable
            data={this.props.users ? Object.values(this.props.users) : []}
            columns={keys.map(string => {
              return {
                Header: string
                  .replace('_', ' ')
                  .split(' ')
                  .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' '),
                accessor: string
              };
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

export default withAuthorization(authCondition, adminOnly)(Staff);
