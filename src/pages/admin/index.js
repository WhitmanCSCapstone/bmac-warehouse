/**
 *  A component
 */

import React from 'react';
import {auth, db} from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import {tableKeys} from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import {SignUpForm} from '../../components/SignUp';
import {Input, Button, Modal } from 'antd';
import PasswordChangeForm from '../../components/PasswordChange';
import AddUser from '../../components/AddUser';

var admin = require('firebase-admin');

var serviceAccount = require('.././../bmac-bens-dev-firebase-adminsdk-wmsrw-0e76eb507a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<BMAC-BENS-DEV>.firebaseio.com'
});

const keys = tableKeys['users'];

const styles = {
    container: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    }
};
var INITIAL_STATE = {
    email: null,
}


class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }
  
    componentDidMount(){
        db.onceGetUsers().then(snapshot => {
          var data = snapshot.val();
          data = Object.values(data);
          this.setState({ data: data })
        });
      }


    deleteUser = (uid) => {
        admin.auth().deleteUser(uid)
        .then(function() {
          console.log("Successfully deleted user");
        })
        .catch(function(error) {
          console.log("Error deleting user:", error);
        });
       }



showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

   showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action is not reversible.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  
    render() {
        return (
            <div style={styles.container}>
                <p>
                    <h1>Create Account</h1>
                    <AddUser/>
                </p>
                <p>
                    <h1>User List</h1>
                    
                </p>
                {!this.state.data
                    ? <LoadingScreen/>
                    : <ReactTable
                        data={this.state.data
                        ? this.state.data
                        : []}
                        columns={keys.map(string => {
                        return ({Header: string, accessor: string})
                    }).concat([{
                        Header: null,
                        accessor: null,
                        Cell: row => (
                            <div>
                                
                                <Button type='primary' onClick={this.showModal}> Change Password </Button>
                                <Modal
                                    title="Change Password"
                                     visible={this.state.visible}
                                     onOk={this.handleOk}
                                     onCancel={this.handleCancel}
                                     mask= {false}
                                 >
                                
                                </Modal>
                                <Button type='danger' onClick={this.showDeleteConfirm}> Delete User </Button>
                            </div>
                        )
                        }])}
                        defaultPageSize={10}
                        className="-striped -highlight"/>
}          
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Admin);
