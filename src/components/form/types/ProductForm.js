import React from 'react';
import { db } from '../../../firebase';
import { Input, Select, Divider, Modal, DatePicker, Form } from 'antd';
import { hasErrors, generateGenericFormItem } from '../../../utils/misc.js';
import Moment from 'moment';
import Footer from '../Footer';
import FundsSourceDropdown from '../FundsSourceDropdown.js';
import { styles } from './styles';

const { TextArea } = Input;
const Option = Select.Option;

//Provider Form Component
class ProductForm extends React.Component {
  defaultState = {
    product_id: null,
    material_number: null,
    funding_source: null,
    unit_weight: null,
    unit_price: null,
    initial_date: null,
    initial_stock: null,
    minimum_stock: null,
    history: null,
    current_stock: null,
    inventory_date: null,
    status: null,
    uniq_id: null,
    notes: null
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

  onTextChange = (prop, val) => {
    this.setState({ [prop]: val });
  };

  //Used to send the data to the databsae and reset the state.
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData;

        if (row && row.uniq_id) {
          //if we are editing a shipment, set in place
          db.setProductObj(row.uniq_id, newData);
        } else {
          //else we are creating a new entry
          db.pushProductObj(newData);
        }

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this.props.refreshTable(() => {
          this.props.closeModal();
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;

    const accessorsForIntFields = [
      'material_number',
      'unit_weight',
      'unit_price',
      'initial_stock',
      'minimum_stock'
    ];

    return (
      <Modal
        title="Product Form"
        style={{
          top: 20
        }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        okText="Submit"
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
          <Form.Item style={styles.formItem} label={'Product Name:'}>
            {getFieldDecorator('product_id', {
              initialValue: this.state.product_id,
              rules: [
                { whitespace: true, required: true, message: 'Please Enter A Valid Product Name' }
              ]
            })(
              <Input
                placeholder={'Product Name'}
                onChange={e => this.onChange('product_id', e.target.value)}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Funding Source:'}>
            <FundsSourceDropdown
              value={this.state.funding_source}
              onChange={val => this.onChange('funding_source', val)}
              fundingSources={this.props.fundingSources}
            />
          </Form.Item>

          <Divider />

          {accessorsForIntFields.map(accessor => {
            return generateGenericFormItem(
              accessor,
              this.state[accessor],
              val => this.onChange(accessor, val),
              getFieldDecorator,
              'number'
            );
          })}

          <Divider />

          <Form.Item style={styles.formItem} label={'Initial Date:'}>
            {getFieldDecorator('initial_date', {
              initialValue: this.state.initial_date
                ? Moment.unix(this.state.initial_date)
                : undefined,
              rules: [{ type: 'object', required: false }]
            })(
              <DatePicker
                style={styles.datePicker}
                onChange={date => this.onChange('initial_date', Number(date.format('X')))}
                placeholder={'Initial Date'}
                format={'MM/DD/YYYY'}
                allowClear={false}
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
                <Option value={'discontinued'}>Discontinued</Option>
              </Select>
            )}
          </Form.Item>

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

const WrappedProductForm = Form.create({ name: 'ProductForm' })(ProductForm);

export default WrappedProductForm;
