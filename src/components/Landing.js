import React from 'react';
import {Form, Icon, Input, Button, Alert} from 'antd';

function Landing(){
  return(
    <div>
      <br/><br/><br/>
      <center>
      <img src="http://rfhresourceguide.org/Content/cmsImages/logo.jpg"/>
      <h1>Warehouse Management Portal</h1>
      <a href='SignIn'><Button  type="primary" htmlType="submit">Continue</Button></a>
      </center>
    </div>
  );
}
export default Landing;
