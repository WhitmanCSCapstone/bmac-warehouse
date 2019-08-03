import React from 'react';
import { Modal, Form } from 'antd';
import { auth, db } from '../../../firebase';
import { Input, Select } from 'antd';
import * as ROLES from '../../../constants/roles';
import { hasErrors } from '../../../utils/misc.js';
import Footer from '../Footer';
import { styles } from './styles';
import PasswordFields from './PasswordFields';
import isEmail from 'validator/lib/isEmail';

const Option = Select.Option;

const byPropKey = (propertyName, value) => () => ({ [propertyName]: value });

//Staff Form Component
class StaffForm extends React.Component {
  defaultState = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    role: '',
    uniq_id: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultState,
      ...this.props.rowData
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({ ...this.defaultState, ...this.props.rowData });
    }
  }

  //Used to send the data to the databsae and reset the state.
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err && !this.state.error) {
        showLoadingAnimation();

        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData;

        // currently this chunk is unused
        // but will likely be needed in future
        const roles = [];
        if (this.state.role === 'Admin') {
          roles.push(ROLES.ADMIN);
        } else {
          roles.push(ROLES.STANDARD);
        }

        newData.password = newData.passwordOne;
        delete newData.passwordOne;
        delete newData.passwordTwo;

        const callback = () => this.props.refreshTable(this.props.closeModal);

        if (row && row.uniq_id) {
          // if we are editing a user, set in place
          db.setUserObj(row.uniq_id, newData, callback);
        } else {
          // else we are creating a new user
          db.createNewUser(newData, callback).catch(error => {
            this.setState(byPropKey('error', error));
          });
        }
      }
    });
  };

  onStatusChange = value => {
    this.setState({ role: value });
  };

  handleDelete = showLoadingAnimation => {
    showLoadingAnimation();
    db.deleteUserObj(this.props.rowData.uniq_id, () =>
      this.props.refreshTable(this.props.closeModal)
    ).catch(error => {
      this.setState(byPropKey('error', error));
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;

    const isInvalid = this.state.passwordOne !== this.state.passwordTwo;
    const isCreatingNewUser = !this.props.rowData;

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
            handleDelete={this.handleDelete}
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

          {!isCreatingNewUser ? null : (
            <Form.Item style={styles.staffFormItem} label={'Email:'}>
              {getFieldDecorator('email', {
                initialValue: this.state.email,
                rules: [
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please Enter A Valid Email',
                    validator: (rule, value, callback) => isEmail(value)
                  }
                ]
              })(
                <Input
                  placeholder={'Email'}
                  onChange={event => this.setState(byPropKey('email', event.target.value))}
                />
              )}
            </Form.Item>
          )}

          <Form.Item style={styles.staffFormItem} label={'Role:'}>
            {getFieldDecorator('role', {
              initialValue: this.state.role,
              rules: [
                {
                  required: true,
                  message: 'Please Select A Role'
                }
              ]
            })(
              <Select placeholder={'Role'} onChange={val => this.setState(byPropKey('role', val))}>
                <Option value={'Admin'}>Admin</Option>
                <Option value={'Standard'}>Standard</Option>
              </Select>
            )}
          </Form.Item>

          <PasswordFields
            isCreatingNewUser={isCreatingNewUser}
            styles={styles}
            error={this.state.error}
            isInvalid={isInvalid}
            onChange={(prop, event) => this.setState(byPropKey(prop, event.target.value))}
            getFieldDecorator={getFieldDecorator}
          />
        </Form>
      </Modal>
    );
  }
}

const WrappedStaffForm = Form.create({ name: 'StaffForm' })(StaffForm);

export default WrappedStaffForm;
