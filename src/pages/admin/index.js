import React from 'react';
import {db} from '../../firebase';
import ReactTable from 'react-table';
import {Button, Modal} from 'antd';

import {tableKeys} from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import AddUser from '../../components/AddUser';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import LoadingScreen from '../../components/LoadingScreen';

//ADMIN ACCOUNT INITIALIZATION
/*

var serviceAccount = require('../../../src/bmac-bens-dev-firebase-adminsdk-wmsrw-1f41938601.json');
admin.initializeApp({
    credential: admin
        .credential
        .cert(serviceAccount),
    databaseURL: 'https://<BMAC-BENS-DEV>.firebaseio.com'
});

var admin = require('firebase-admin');
//import admin from 'firebase-admin';
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "bmac-bens-dev",
      clientEmail: "firebase-adminsdk-wmsrw@bmac-bens-dev.iam.gserviceaccount.com",
      privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrH5PVFku2URF+\nD64jx+g7jTdrW8WF0mUnXNUkLrrGUTwysb9ODW/yUj12+e0wYBRiqgCpOPWym/8c\n8zwyCrOE0xzlTq66CLFf5hZhFOA6/31Fa7Pzh9+XxrP9iqJUJFdvXk648nPHd0Ci\n2tCsd/3a38NVPNMF0JgzGAx4YaGk9j55LR735m7N9KXyv3Py4WUgwBXX94ZfYxyd\nRG6/qkcZvjuRr2fcdZmPXtiOZ6/j9vkMhRBocDnRiHBABh95L6mk08bcIq6w06nr\n0mYusutG71Wxdmd86DWbwPD01buG7X1AdDS4rKdDrZcDDTpVzbF+dqtCLKciWdKR\noBhhgw+pAgMBAAECggEABt9Op0dSZ3+NDj+dthrnsxLjqQHPYSWUZvlp0hP3hQel\n5+DJeVOy6AZ2E2FBOEOW31QAZmC5haXmv9BDvdGTc6gBUEhhyL+Y36xclXiacpAd\nuoQd6YUOnW3Z1GVlCcVIXCUA0G656DFcOjYYsjZ4Q89093yTpSIDPMO7BiTLR7Xu\nz6tzwMzvZeyEC6WN8hfJPmfcqA4AtoWa1Z7EinI++xiMG3LIvasm8/1mi17cFxLZ\nd5+LSBOVB92NsqfC7ESeybJibqykbVV6/Jd7vxA9G7J5dsu1/jHd4TmmnZw34hKQ\nK0oXW9a9OqCmM/pG289pql9hea8i7IQ/nhrA+gL7oQKBgQDv38gX2LjJk77ck+Wv\n4OBz6A9/Ir7tlZAKAiEhrdJXqzv/BUOpCKGAtHTckbj0xt7cvnmo8EOuJVOGuoCK\nLdvlFOXLSF7YdQVPicgl8Nj6eH7Fjz5uYxTsbyNy994n9GZdt2mPOXbmrGLeYmI8\naYPKWZdfqARkOI7kOf7zhSPXIQKBgQC2oJlgZ1G2Nskp62gOmi2Frea3GPOsjzDa\n6E76Y5aBtfS6KOuVSIR+SiwRtS1Tj2uFMEi7RcmK76X9aZP4jzXq/fHq4+7qcm4O\nksXw/2l+Goe2fbA5/IiXKRYZ6ZxxZD4X7Sr08AZhmGj9z9kTThE5OI5WEGnp3AZj\nVMKuQnoPiQKBgQDWagz8q985aBSCLL1yAiv/zx4TAabyze7r0010QmCztr8xTK5X\nKPzcA/I1uxg9zIonfSdYiDOnNXw9APanDSjy00Q4+l61U5zEpR9AMtJwyUZgJ5Oh\nrnVkhk+Ek+WDh2X9PVZhDPeoZ80UhZLT92kzdfPmMFSElT286c5oNMl9oQKBgC5H\nxJaJmEt01sWowlXw/FhEGZOM3zN7lgXjmSAa3KlCUyJZ/Fl4ZxsZ8NEL+NCUJ8s4\n0TWkGc77rDTr7HOw1xkWAZhk6sa++OT4jPDlyPYMAxhcAaywMm0cHF20tdCGdrXZ\nhGlN6lARL4oiggBCaFr32ho1TqHVAElr0WoXrpcBAoGBAJ3sB6AdX3xnKd/gjvUa\nQvQMvtCk5la3xnLRmxCoM2q/0k0nm70m1/8J3X39WIkjve8+o6gUGlRxOaJWulLg\nvZp1B2nsGt7D0enVhQ4JcITEe6wjjZ1vHf9GhZbostuKcoh5/Mp7rPUyWtsg61nT\nIkGKRx08s6SdcsbHyg0TaS6o\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: 'https://<BMAC-BENS-DEV>.firebaseio.com'
  });
  */

//Reference to constants for column headers.
const keys = tableKeys['users'];

const styles = {
    container: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        background: '#fff', 
        padding: 24, 
        minHeight: 280 
    }
};

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            visiblePasswordChange: false
        }
    }
    //Fetch data for the table at start of page load.
    componentDidMount() {
        db
            .onceGetUsers()
            .then(snapshot => {
                var data = snapshot.val();
                data = Object.values(data);
                this.setState({data: data})
            });
    }
    /*
    When the Delete button is clicked, the email from the second column is stored in a variable.
    We can then call the find user admin function using the email to obtain the user's unique ID,
    and from there delete the user by passing the UID to the delete user function.
    */
    onDeleteClick = row => {
        var email = JSON.stringify(row.original.email);
        console.log(email);
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action is not reversible.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                /*
                //With the user's email look up the unique ID.
                admin
                    .auth()
                    .getUserByEmail(email)
                    .then(function (userRecord) {
                        console.log("Successfully fetched user data:", userRecord.toJSON());
                        //Then you'd call delete here by using the unique ID we got earlier.
                        admin
                            .auth()
                            .deleteUser(userRecord)
                            .then(function () {
                                console.log("Successfully deleted user");
                            })
                            .catch(function (error) {
                                console.log("Error deleting user:", error);
                            });

                    }) 
                    .catch(function (error) {
                        console.log("Error fetching user data:", error);

                    });
*/
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    /*
    These functions are necessary for the password change modal to pop up.
    Once I figure out how to make it conditonally render then we can remove these
    as they are also present in the PasswordChangeModal.js file.
*/

    showModal = () => {
        return;
    }

    render() {
        return (
           
            <div style={styles.container}>
                
                    <h1>Create Account</h1>
                    <AddUser/>
               
                
                    <h1>User List</h1>

                
                {!this.state.data
                    ? <LoadingScreen/>
                    : <ReactTable
                        data={this.state.data
                        ? this.state.data
                        : []}
                        columns={keys.map(string => {
                        return ({Header: string, accessor: string})
                    }).concat([
                        {
                            Header: "Actions",
                            accessor: null,
                            Cell: row => (
                                <div>
                                    <Button type='primary' onClick={this.showModal}>
                                        Change Password
                                    </Button>
                                    <PasswordChangeModal visiblePasswordChange={this.visiblePasswordChange}/>
                                    <Button
                                        type='danger'
                                        onClick={this
                                        .onDeleteClick
                                        .bind(this, row)}>
                                        Delete User
                                    </Button>
                                </div>
                            )
                        }
                    ])}
                        defaultPageSize={10}
                        className="-striped -highlight"/>
}
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Admin);
