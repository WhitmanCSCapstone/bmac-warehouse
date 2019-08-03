import React from 'react';
import { Divider, Alert, Form, Input } from 'antd';

function PasswordFields(props) {
  return (
    <div style={props.styles.fullWidthFormItem}>
      {!props.isCreatingNewUser ? null : (
        <div>
          <Divider orientation={'left'}>Password</Divider>

          <Form.Item style={props.styles.passwordField} label={'Password:'}>
            {props.getFieldDecorator('passwordOne', {
              initialValue: props.passwordOne,

              rules: [{ whitespace: true, required: true, message: 'Please Enter A Password' }]
            })(
              <Input
                placeholder={'Password'}
                type={'password'}
                onChange={event => props.onChange('passwordOne', event)}
              />
            )}
          </Form.Item>

          <Form.Item style={props.styles.passwordField} label={'Retype Password:'}>
            {props.getFieldDecorator('passwordTwo', {
              initialValue: props.passwordTwo,
              rules: [{ whitespace: true, required: true, message: 'Please Enter A Password' }]
            })(
              <Input
                placeholder={'Password'}
                type={'password'}
                onChange={event => props.onChange('passwordTwo', event)}
              />
            )}
          </Form.Item>

          <Form.Item style={props.styles.passwordField}>
            <div style={props.styles.errorMessage}>
              {props.isInvalid &&
                props.username !== null &&
                props.email !== null &&
                props.passwordOne !== null &&
                props.passwordTwo !== null && (
                  <Alert message={'Passwords do not match.'} type={'warning'} showIcon />
                )}
            </div>
            <div id={'alert'} style={props.styles.errorMessage}>
              {props.error && (
                <Alert message={props.error.message} type={'error'} timeout={'3sec'} showIcon />
              )}
            </div>
          </Form.Item>
        </div>
      )}
    </div>
  );
}

export default PasswordFields;
