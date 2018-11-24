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

const keys = tableKeys['staff'];

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
            email: null,
        }
    }
    componentDidMount() {
        db
            .onceGetStaff()
            .then(snapshot => this.setState({
                data: snapshot.val()
            }));
    }

    //What other functionality do we want on this page.
    /*
  var user = firebase.auth().currentUser;

  user.delete().then(function() {
    // User deleted.
  }).catch(function(error) {
    // An error happened.
  });
  */

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
                    <h1>Delete Someone's Account</h1>
                    <Input placeholder="User's Email" value={this.state.email} onChange={this.handleEmailChange}></Input>
                    <Button type='danger'>Delete Account</Button>
                </p>
                {!this.state.data
                    ? <LoadingScreen/>
                    : <ReactTable
                        data={this.state.data
                        ? this.state.data
                        : []}
                        columns={keys.map(string => {
                        return ({Header: string, accessor: string})
                    })}
                        defaultPageSize={10}
                        className="-striped -highlight"/>
}               <p><h1>Change Someone's Password</h1>
</p>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Admin);
