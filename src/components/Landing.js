import React from 'react';
import { Button} from 'antd';

function Landing(){
  return(
    <div>
      <br/><br/><br/>
      <center>
      <img alt='' src="http://rfhresourceguide.org/Content/cmsImages/logo.jpg"/>
      <h1>BMAC Warehouse Management Portal</h1>
      <a href='SignIn'><Button  type="primary" htmlType="submit">Sign In</Button></a>
      </center>
    </div>
  );
}
export default Landing;
