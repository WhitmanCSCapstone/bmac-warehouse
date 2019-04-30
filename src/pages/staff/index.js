import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import { Button } from 'antd';
import StaffForm from '../../components/form/types/StaffForm';

const keys = tableKeys.users;

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
};

class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      formModalVisible: false,
    };
  }

  componentDidMount() {
    this.refreshTable();
  }

    refreshTable = () => {
      db
        .onceGetUsers()
        .then((snapshot) => {
          let data = snapshot.val();
          data = Object.values(data);
          this.setState({ data });
        });
    }

    render() {
      return (
        <div style={styles.container}>

          <Button type="primary" onClick={() => this.setState({ formModalVisible: true })}>
                    Add New User
          </Button>
          <StaffForm
            formModalVisible={this.state.formModalVisible}
            refreshTable={this.refreshTable}
            closeForm={() => this.setState({ formModalVisible: false })}
          /> {!this.state.data
                    ? <LoadingScreen />
                    : <ReactTable
                      data={this.state.data
                        ? this.state.data
                        : []}
                      columns={keys.map(string => ({
                            Header: string
                                .replace('_', ' ')
                                .split(' ')
                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(' '),
                            accessor: string,
                        }))}
                      defaultPageSize={10}
                      className="-striped -highlight"
                    />
}
        </div>
      );
    }
}

const authCondition = authUser => !!authUser;

const adminOnly = true;

export default withAuthorization(authCondition, adminOnly)(Staff);
