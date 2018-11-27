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
import {Input, Button} from 'antd';

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
            email: null
        }
    }
    componentDidMount() {
        db
            .onceGetUsers()
            .then(snapshot => this.setState({
                data: snapshot.val()
            }));
    }

    deleteUser = () => {
      
       }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    render() {
        return (
            <div style={styles.container}>
                <p>
                    <h1>Create Account</h1>
                    <SignUpForm/>
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
                                <Button type='danger'> Delete User </Button>
                                <Button type='primary'> Change Password </Button>
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
