import React from 'react';
import { Divider, Modal, Alert, Form } from 'antd';
import { auth, db } from '../../../firebase';
import { Input, Select } from 'antd';
import * as ROLES from '../../../constants/roles';
import { hasErrors } from '../../../utils/misc.js';
import Footer from '../Footer';
import { styles } from './styles';

const Option = Select.Option;

const byPropKey = (propertyName, value) => () => ({ [propertyName]: value });

//Staff Form Component
class StaffForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: null,
      role: ''
    };
  }

  //Used to send the data to the databsae and reset the state.
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err && !this.state.error) {
        showLoadingAnimation();
        const roles = [];

        if (this.state.role === 'Admin') {
          roles.push(ROLES.ADMIN);
        } else {
          roles.push(ROLES.STANDARD);
        }

        auth
          .doCreateUserWithEmailAndPassword(this.state.email, this.state.passwordOne) // Creates user in auth platform.
          .then(authUser => {
            // Create a user in your own accessible Firebase Database too
            db.doCreateUser(
              authUser.user.uid,
              this.state.username,
              this.state.email,
              this.state.role
            )
              .then(() => {
                this.setState({
                  username: '',
                  email: '',
                  passwordOne: '',
                  passwordTwo: '',
                  error: null,
                  role: ''
                });
                this.props.refreshTable(this.props.closeForm);
              })
              .catch(error => {
                this.setState(byPropKey('error', error));
              });
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
      }
    });
  };

  onStatusChange = value => {
    this.setState({ role: value });
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;

    const isInvalid = this.state.passwordOne !== this.state.passwordTwo;

    return (
      <Modal
        title={'Add New Staff Member'}
        style={{
          top: 20
        }}
        width={'30vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key={'footer'}
            rowData={this.props.rowData}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
            saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError()) || isInvalid}
          />
        ]}
      >
        <Form layout={'vertical'} style={styles.form}>
          <Form.Item style={styles.staffFormItem} label={'Username:'}>
            {getFieldDecorator('username', {
              initialValue: this.state.username,
              rules: [{ whitespace: true, required: true, message: 'Please Enter A Username' }]
            })(
              <Input
                placeholder={'Username'}
                onChange={event => this.setState(byPropKey('username', event.target.value))}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.staffFormItem} label={'Email:'}>
            {getFieldDecorator('email', {
              initialValue: this.state.email,
              rules: [{ whitespace: true, required: true, message: 'Please Enter A Email' }]
            })(
              <Input
                placeholder={'Email'}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.staffFormItem} label={'Role:'}>
            {getFieldDecorator('role', {
              initialValue: this.state.role,
              rules: [{ required: true, message: 'Please Select A Role' }]
            })(
              <Select placeholder={'Role'} onChange={val => this.setState(byPropKey('role', val))}>
                <Option value={'Admin'}>Admin</Option>
                <Option value={'Standard'}>Standard</Option>
              </Select>
            )}
          </Form.Item>

          <Divider orientation={'left'}>Password</Divider>

          <Form.Item style={styles.staffFormItem} label={'Password:'}>
            {getFieldDecorator('passwordOne', {
              initialValue: this.state.passwordOne,

              rules: [{ whitespace: true, required: true, message: 'Please Enter A Password' }]
            })(
              <Input
                placeholder={'Password'}
                type={'password'}
                onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.staffFormItem} label={'Password:'}>
            {getFieldDecorator('passwordTwo', {
              initialValue: this.state.passwordTwo,
              rules: [{ whitespace: true, required: true, message: 'Please Enter A Password' }]
            })(
              <Input
                placeholder={'Password'}
                type={'password'}
                onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.staffFormItem}>
            <div style={styles.errorMessage}>
              {isInvalid &&
                this.state.username !== null &&
                this.state.email !== null &&
                this.state.passwordOne !== null &&
                this.state.passwordTwo !== null && (
                  <Alert message={'Passwords do not match.'} type={'warning'} showIcon />
                )}
            </div>
            <div id={'alert'} style={styles.errorMessage}>
              {this.state.error && (
                <Alert
                  message={this.state.error.message}
                  type={'error'}
                  timeout={'3sec'}
                  showIcon
                />
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedStaffForm = Form.create({ name: 'StaffForm' })(StaffForm);

export default WrappedStaffForm;
