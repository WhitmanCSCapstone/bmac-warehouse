import React from 'react';
import { db } from '../../../firebase';
import { Input, Select, Divider, Modal, Form } from 'antd';
import { hasErrors, generateGenericFormItem } from '../../../utils/misc.js';
import Footer from '../Footer';
import { styles } from './styles';

const { TextArea } = Input;
const Option = Select.Option;

class CustomerForm extends React.Component {
  defaultState = {
    customer_id: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    county: null,
    contact: null,
    phone: null,
    email: null,
    status: null,
    notes: null,
    uniq_id: null
  };

  constructor(props) {
    super(props);
    this.state = { ...this.defaultState, ...props.rowData };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({ ...this.defaultState, ...this.props.rowData });
    }
  }

  onChange = (prop, val) => {
    this.setState({
      [prop]: val
    });
  };

  onStatusChange = value => {
    this.setState({ status: value });
  };

  //Ok Click
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData;
        const callback = () => this.props.refreshTable(this.props.closeModal);

        if (row && row.uniq_id) {
          db.setCustomerObj(row.uniq_id, newData, callback);
        } else {
          db.pushCustomerObj(this.state, callback);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;

    const accessorsForStringFields = [
      'address',
      'city',
      'state',
      'zip',
      'contact',
      'phone',
      'email'
    ];

    return (
      <Modal
        title="Customer Form"
        style={{ top: 20 }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key="footer"
            rowData={this.props.rowData}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
            saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError())}
          />
        ]}
      >
        <Form layout={'vertical'} style={styles.form}>
          <Form.Item style={styles.formItem} label={'Customer Name:'}>
            {getFieldDecorator('customer_id', {
              initialValue: this.state.customer_id,
              rules: [
                { whitespace: true, required: true, message: 'Please Enter A Valid Customer Name' }
              ]
            })(
              <Input
                placeholder={'Customer Name'}
                onChange={e => this.onChange('customer_id', e.target.value)}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Status:'}>
            {getFieldDecorator('status', {
              initialValue: this.state.status ? this.state.status : undefined,
              rules: [{ required: true }]
            })(
              <Select placeholder={'Status'} onChange={val => this.onChange('status', val)}>
                <Option value={'active'}>Active</Option>
                <Option value={'inactive'}>Inactive</Option>
              </Select>
            )}
          </Form.Item>

          <Divider orientation={'left'}>Customer Information</Divider>

          {accessorsForStringFields.map(accessor => {
            return generateGenericFormItem(
              accessor,
              this.state[accessor],
              e => this.onChange(accessor, e.target.value),
              getFieldDecorator,
              'string'
            );
          })}

          <Divider />

          <Form.Item style={{ ...styles.formItem, ...styles.notes }} label={'Notes:'}>
            {getFieldDecorator('notes', {
              initialValue: this.state.notes
            })(
              <TextArea
                rows={4}
                placeholder={'Notes'}
                onChange={e => this.onChange('notes', e.target.value)}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedCustomerForm = Form.create({ name: 'CustomerForm' })(CustomerForm);

export default WrappedCustomerForm;
