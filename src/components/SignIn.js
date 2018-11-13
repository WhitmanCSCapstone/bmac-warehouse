import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button } from 'antd';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import img from '../blues4.jpg';
import logo from '../bmac_logo.png';

const styles = {
    splitScreen: {
        display:'flex',
        flex: 'row',
    },
    splitA: {
        borderTop: '5px solid #2C7BE5',
        width:'35%',
        height:'925px',
        backgroundColor: 'off-white',
    },    
    splitB: {
        width:'65%',
        backgroundImage: 'url(' + img + ')',
        backgroundRepeat: 'no-repeat',

    },  
    prettyForm: {
        display:'flex',
        flexDirection:'column',
        maxWidth: '400px',
        justifyContent:'center', 
        alignItems:'center',
        marginLeft: '12%',
        marginRight: '12%',
    },  

    prettyElement: {
        width:'100%',
        marginTop: '5%',
    }, 

    prettyBottom: {
        marginBottom: '3%',
    },                  
};

const SignInPage = ({ history }) =>
  <div>
    <div style={styles.splitScreen}>
        <div style={styles.splitA}>
            <div style={styles.prettyForm}>
                <br/><br/><br/><br/>
                <br/>
               
                <br/><br/><br/><br/><br/>
                <h1><font color="#12263f">Sign In</font></h1>
                <p>Access to BMAC Warehouse requires a Username and a Password for viewing.
                </p>
                <SignInForm history={history} />
                <PasswordForgetLink />
            </div>
        </div>
        <div style={styles.splitB}></div>
    </div>
  </div>;

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            email,
            password,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                history.push(routes.DASHBOARD);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
              password === '' ||
              email === '';

        return (
        <div>
            <Form onSubmit={this.onSubmit}>

            
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
                type="text"
                style={styles.prettyBottom}
                placeholder='Email Address'
              />
            
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                value={password}
                onChange={event => this.setState(byPropKey('password', event.target.value))}
                type="password"
                placeholder="Password"
              />
              <Button disabled={isInvalid} onClick={this.onSubmit} type="primary" style={styles.prettyElement}>
                Sign In
              </Button>
              { error && < p>{error.message}</p> }
            </Form>
        </div>
        );
    }
}

export default withRouter(SignInPage);

export {
    SignInForm,
};
