import React, { Component } from 'react';

import {Button, Modal} from 'antd';
import { SignUpForm } from './SignUp';


class AddUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            error: null
        };
      }

      showModal = () => {
        this.setState({
          visible: true,
        });
      }
    
      handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        
        });
        this.forceUpdate();   
      }
    
      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
    
      render() {
        return (
          <div>
            <Button type="primary" size="large" onClick={this.showModal}>
              Add User
            </Button>
            <Modal
              title="Add a User"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
             <SignUpForm/>
            </Modal>
          </div>
        )}
    }


    export default AddUser;