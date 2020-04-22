import React from 'react';
import { Button } from 'antd';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh'
  }
};

function Landing() {
  return (
    <div style={styles.container}>
      <img alt="" src="http://rfhresourceguide.org/Content/cmsImages/logo.jpg" />
      <h1>BMAC Warehouse Management Portal</h1>
      <a href="SignIn">
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </a>
    </div>
  );
}
// export default withRouter(SignInPage);

// export { SignInForm, ReturnToSignIn };
export default Landing;
