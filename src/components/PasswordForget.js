import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input } from 'antd';
import { auth } from '../firebase';
import * as routes from '../constants/routes';

import img from '../blues4.jpg';
import { ReturnToSignIn } from './SignIn';

const styles = {
  splitScreen: {
    display: 'flex',
    flex: 'row'
  },
  splitA: {
    borderTop: '5px solid #2C7BE5',
    width: '35%',
    height: '925px',
    backgroundColor: 'off-white'
  },
  splitB: {
    width: '65%',
    backgroundImage: `url(${img})`,
    backgroundRepeat: 'no-repeat'
  },
  prettyForm: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '12%',
    marginRight: '12%'
  },

  prettyElement: {
    width: '100%',
    marginTop: '5%'
  },

  prettyBottom: {
    marginBottom: '3%'
  },

  errorBox: {
    paddingBottom: '2%'
  }
};

const PasswordForgetPage = () => (
  <div>
    <div style={styles.splitScreen}>
      <div style={styles.splitA}>
        <div style={styles.prettyForm}>
          <br />
          <br />
          <br />
          <br />
          <br />

          <br />
          <br />
          <br />
          <br />
          <br />
          <h1>Reset My Password</h1>
          <p>
            Please enter the email associated with your account to receive an email with a link to
            reset your password.
          </p>
          <PasswordForgetForm />
          <ReturnToSignIn />
        </div>
      </div>
      <div style={styles.splitB} />
    </div>
  </div>
);

const byPropKey = (propertyName, value) => () => ({ [propertyName]: value });

const INITIAL_STATE = {
  email: '',
  error: null
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE
    };
  }

  onSubmit = event => {
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => {
        this.setState({
          ...INITIAL_STATE
        });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          value={this.state.email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />

        <Button disabled={isInvalid} htmlType="submit" style={styles.prettyElement} type="primary">
          Reset My Password
        </Button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
