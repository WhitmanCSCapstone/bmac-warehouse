import React from 'react';
import { Button } from 'antd';
import { auth } from '../firebase';

const SignOutButton = () => (
  <Button type="danger" onClick={auth.doSignOut}>
    Sign Out
  </Button>
);
export default SignOutButton;
