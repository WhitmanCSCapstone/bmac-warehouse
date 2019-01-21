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
import * as admin from "firebase-admin";
/*
var serviceAccount = require('../../../src/bmac-bens-dev-firebase-adminsdk-wmsrw-1f41938601.json');
admin.initializeApp({
    credential: admin
        .credential
        .cert(serviceAccount),
    databaseURL: 'https://<BMAC-BENS-DEV>.firebaseio.com'
});
*/
admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'bmac-bens-dev',
      client_email: "firebase-adminsdk-wmsrw@bmac-bens-dev.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDdlmE1UMYY0zLi\nuANncOD/FfACKv2QsbMZxi3yTkazYN7UPIpEq4sI0B/s1//p7j7VIg5WuF9pmH8v\nW6oc4bWtxiGRgGZY7VvYsbJy7gp/VdAhlzqG33vpcWbP7HJTH4qRy5xkKeaTCe7L\nKF4pC/jCcEECLlgUsgSFXHuIXkQ4LCUcSk4wFEatKlY9tE5ghH3qbnOaTAOL5/z8\nnSoFSkRUpr4In/oRA0Ekk9z/Ok3PPPRleZqDUZdn6g8E6JToj/wy4Pq1NX3lmD28\nN3V6/cPeSRHiA60nKza0I9Oi2A+7q3MSbak1b0tLR+LMy7Ch/LK2D5KO2jhB1Jv6\ndtxdLWu/AgMBAAECggEAZ4hk4QFdnanIg9AQnxtJtUXtv0WQ9jNhCHDldOqH9DYV\nxzqGLDGuo66CzCncQ9PyfakM5A3/XppHCrycjiQTvB7v/kjtCS3WFThptXNtajOR\nLLC5Qt1WyysWK55BiH8bQqXM66v8NMWWUkwJOsqCL289oKRAuWK35AvjGENbQpbW\nsqwh6GBWtTI3gzjBVSvUMt8OB02XeZJhuEOsUOPkm9rUpE8SKjr3YLSYhgCRxS0Y\ns+7lqMGOmP8AkhAkhuwS5FR1cKQdXkb3YQhAJ3rF8EiFCF48Dbq6wUs3+Djp/qZA\nACDXzCJ5tDNq21OT6Nj8Dg4gHWAu0JVcllF8ugG6mQKBgQD+JY4fvbo3WLOoVYos\n6YA1GKjV7Dg3XE/DuRrUqtJl8QcgCQ+0CsBRGpQCPHNEEwJ8V1MI/Zyo0mN6UJHM\nSuzNryK0PegORLUUtkoxejxyA3n+/JUFnDzdc+3QtvIacJcJCYrhHby5NhNPfG8x\nNPyg+Ki+fqHOfX+JnfcjQaqymwKBgQDfNAra6jgog9VjD+HLAOjmxcofeofy4l84\njDTv/z9dpJzUPRS0ZxSqs6EwcLh58M6qCoaQhZ8RH8ZKMFMEP8NjFKYkHOGnwY53\nFUM9vCjiIsl6Z931q3ZzKuAzB/s92xM4uyL48RzSnlaEhtdzSp2HDQgjcsb0SlAH\nb+cJ+ws7rQKBgQD7DFoCXMZwGb0OkcD2cInm6T8OYlN9zEA21Mj+PuerL5acPJc4\ngE5NT3XZZ6FtI2IXNaOeg/eWhI0jrCb5qSGWZGRhq61pOtGtbgyIJ3lCHtEJ4rPK\nYPV2xCetPqqVF5b6pGR9z4Q3aIVWxVKJRxAuarM1yZ1IfovXgyU3vIxD9QKBgQCJ\nSwHCVn/kq/L91C8XJ6AbE16Yrk4hYI0hw1xso5zehPrSsh+iOCXGOmfT3AIdP7pf\nbcoH66lEZz8ZM1BdNLuCnpjzbbB/99ch+Lo7pxmev7cey/UDwExD2wO9YBNyoObZ\n5oJEjkskYrDlI+wyxprPD30KEPfAHFXNvU9oHDt0oQKBgQDpbINwKgZQH++qQi21\n1PjUZCJ9v9x2+hDaNjxHCvcB5OxP33SOXqbUadrIQx1Kkql2MQ6NSJmtdMpJ2JPK\nsQE6IkQUkS7a/Ifv86oTpxGGGWqP+eNKk8yKEB4/7m1vRPq2WyHZBEYz9wJuGOZU\n16R3a4ltePCGDKgv8apy9/v7yg==\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: 'https://<BMAC-BENS-DEV>.firebaseio.com'
  });

//Reference to constants for column headers.
const keys = tableKeys['users'];

const styles = {
    container: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
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
        this.setState({visiblePasswordChange: true});
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({visiblePasswordChange: false});
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({visiblePasswordChange: false});
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
