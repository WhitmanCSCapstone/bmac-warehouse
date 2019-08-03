import React from 'react';
import { db } from '../../../firebase';
import { Input, Select, Divider, Modal, Form } from 'antd';
import { hasErrors, generateGenericFormItem } from '../../../utils/misc.js';
import Footer from '../Footer';
import { styles } from './styles';

//This is for the notes section.
const { TextArea } = Input;
//This is for the status dropdown.
const Option = Select.Option;

//Provider Form Component
class ProviderForm extends React.Component {
  defaultState = {
    provider_id: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    county: null,
    phone: null,
    contact: null,
    email: null
  };
  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultState,
      ...props.rowData
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({
        ...this.defaultState,
        ...this.props.rowData
      });
    }
  }

  onChange = (prop, val) => {
    this.setState({
      [prop]: val
    });
  };

  //Used to send the data to the databsae and reset the state.
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData;
        const callback = () => this.props.refreshTable(this.props.closeModal);

        if (row && row.uniq_id) {
          db.setProviderObj(row.uniq_id, newData, callback);
        } else {
          db.pushProviderObj(this.state, callback);
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
      'county',
      'contact',
      'phone',
      'email'
    ];

    return (
      <Modal
        title={'Provider Form'}
        style={{
          top: 20
        }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        okText={'Submit'}
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key={'footer'}
            rowData={this.props.rowData}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
            saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError())}
          />
        ]}
      >
        <Form layout={'vertical'} style={styles.form}>
          <Form.Item style={styles.formItem} label={'Provider Name:'}>
            {getFieldDecorator('provider_id', {
              initialValue: this.state.provider_id,
              rules: [
                { whitespace: true, required: true, message: 'Please Enter A Valid Provider Name' }
              ]
            })(
              <Input
                placeholder={'Provider Name'}
                onChange={e => this.onChange('provider_id', e.target.value)}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Status:'}>
            {getFieldDecorator('status', {
              initialValue: this.state.status,
              rules: [{ required: true, message: 'Please Select A Status' }]
            })(
              <Select placeholder={'Status'} onChange={val => this.onChange('status', val)}>
                <Option value={'active'}>Active</Option>
                <Option value={'inactive'}>Inactive</Option>
              </Select>
            )}
          </Form.Item>

          <Divider orientation={'left'}>Contact Information</Divider>

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

const WrappedProviderForm = Form.create({ name: 'ProviderForm' })(ProviderForm);

export default WrappedProviderForm;
