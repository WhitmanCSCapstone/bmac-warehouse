import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import {Button, Input} from 'antd';

const SignUpPage = ({ history }) =>
  <div>

    <SignUpForm history={history} />
  </div>

  const INITIAL_STATE = {
    username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: null,
  };

  const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });

  class SignUpForm extends Component {
    constructor(props) {
      super(props);

      this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
      const {
        username,
        email,
        passwordOne,
      } = this.state;

      const {
        history,
      } = this.props;
      // Create a user in the Firebase User Table
      auth.doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {

            // Create a user in our own accessible Firebase Database
            db.doCreateUser(authUser.user.uid, username, email)
              .then(() => {
                this.setState({ ...INITIAL_STATE });
                history.push(routes.DASHBOARD);
              })
              .catch(error => {
                this.setState(byPropKey('error', error));
              });

          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });

      event.preventDefault();
    }

    render() {
      const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
      } = this.state;

      const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

      return (
        <form onSubmit={this.onSubmit}>
          <Input
            value={username}
            onChange={event => this.setState(byPropKey('username', event.target.value))}
            type="text"
            placeholder="Full Name"
          />
          <Input
            value={email}
            onChange={event => this.setState(byPropKey('email', event.target.value))}
            type="text"
            placeholder="Email Address"
          />
          <Input
            value={passwordOne}
            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            placeholder="Password"
          />
          <Input
            value={passwordTwo}
            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            placeholder="Confirm Password"
          />
          <Button disabled={isInvalid} htmlType="submit">
            Sign Up
          </Button>

          { error && <p>{error.message}</p> }
        </form>
      );
    }
  }

  const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>;

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};
