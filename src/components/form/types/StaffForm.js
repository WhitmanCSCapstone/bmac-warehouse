import React from 'react';
import { Divider, Modal, Alert} from 'antd';
import {auth, db} from '../../../firebase';
import {Input} from 'antd';

//Styles
const styles = {
    form: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },

    formItem: {
        width: '45%',
        margin: '0px 1em 1em 1em'
    },

    topThird: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignContent: 'center'
    },

    bottomThird: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    
    errorMessage: {
        display: 'flex',
        width: '100%'
    }
};



const byPropKey = (propertyName, value) => () => ({[propertyName]: value});



//Staff Form Component
class StaffForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            passwordOne: '',
            passwordTwo: '',
            error: null
        }
    }

    //Used to send the data to the databsae and reset the state.
    handleOk = () => {
        const {username, email, passwordOne, passwordTwo} = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';

        if (!isInvalid) {
            auth
                .doCreateUserWithEmailAndPassword(email, passwordOne)
                .then(authUser => {

                    // Create a user in your own accessible Firebase Database too
                    db
                        .doCreateUser(authUser.user.uid, username, email)
                        .then(() => {
                            this.setState({
                                username: '',
                                email: '',
                                passwordOne: '',
                                passwordTwo: '',
                                error: null
                            });
                            this
                                .props
                                .onCancel();
                        })
                        .catch(error => {
                            this.setState(byPropKey('error', error));
                        });

                })
                .catch(error => {
                    this.setState(byPropKey('error', error));
                });

        } 
        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous this.props.refreshTable();
    }

    render() {
        const {username, email, passwordOne, passwordTwo, error} = this.state;

        const isInvalid = passwordOne !== passwordTwo;
        

        return (

            <Modal
                title="Add New Staff Member"
                style={{
                top: 20
            }}
                width={'50vw'}
                destroyOnClose={true}
                visible={this.props.formModalVisible}
                okText='Submit'
                onOk={this.handleOk}
                okButtonProps={{
                disabled: isInvalid
            }}
                onCancel={this.props.onCancel}>
                <div style={styles.form}>
                    <div style={styles.formItem}>
                        <Input
                            value={username}
                            onChange={event => this.setState(byPropKey('username', event.target.value))}
                            type="text"
                            placeholder="Full Name"/>
                    </div>
                    <div style={styles.formItem}>
                        <Input
                            value={email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            type="text"
                            placeholder="Email Address"/>
                    </div>
                    <Divider orientation="left">Password</Divider>

                    <div style={styles.formItem}>

                        <Input
                            value={passwordOne}
                            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                            type="password"
                            placeholder="Password"/>
                    </div>
                    <div style={styles.formItem}>
                        <Input
                            value={passwordTwo}
                            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                            type="password"
                            placeholder="Confirm Password"/>
                    </div>
                    <div  style={styles.errorMessage}>
                        {isInvalid && username !== null && email !== null && passwordOne !== null && passwordTwo !== null && <Alert message="Passwords do not match." type="warning" showIcon/>}
                    </div>
                    <div id="alert" style={styles.errorMessage}>
                        {error && <Alert message={error.message} type="error" timeout="3sec" showIcon/>}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default StaffForm;
