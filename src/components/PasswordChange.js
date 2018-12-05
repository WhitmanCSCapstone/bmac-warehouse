import React, { Component } from 'react';

import { auth } from '../firebase';
import {Button, Input, Form} from 'antd';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
          this.setState(byPropKey('error', error));
        });

    event.preventDefault();
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="New Password"
        />
        <Input
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm New Password"
        />
        <Button disabled={isInvalid} htmlType="submit" type="primary">
          Reset My Password
        </Button>

        { error && <p>{error.message}</p> }
      </Form>
    );
  }
}

export default PasswordChangeForm;
