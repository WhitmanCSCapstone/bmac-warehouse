import React from 'react';
import { Form, Icon, Input, Button, DatePicker, Select, Row, Col } from 'antd';

const FormItem = Form.Item;

const { MonthPicker, RangePicker, Weekpicker } = DatePicker;

const Option = Select.Option;

const styles = {
  container: {
    // backgroundColor: 'teal',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

  },


  sidewise: {
    // backgroundColor : 'red',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'stretch',
  },

  form: {

  },

  button: {
    display: 'flex',
    alignSelf: 'center'
  },
};

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formDisplayToggle: false,
    }
  }

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(keys.length);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  onAddNewShipment = () => {
    this.setState({
      formDisplayToggle: !this.state.formDisplayToggle,
    })
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Product' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input product name or delete this field.",
            }],
          })(
            <Input placeholder="Product Name" style={{ width: '60%', marginRight: 8 }} />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <div style={styles.container}>

        <Button style={styles.button}
          onClick={this.onAddNewShipment}>
          Add New Shipment
        </Button>

        {!this.state.formDisplayToggle ? null :
          <Form style={styles.form}>
            <FormItem>
            </FormItem>

            <FormItem>
              {getFieldDecorator('shipDate', {
                rules: [{ required: true, message: 'Please input the shipping date.' }],
              })(
                <DatePicker onChange={this.onChange} placeholder="Ship Date" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('shipTo', {
                rules: [{ required: true, message: 'Please input the shipping destination.' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Ship to" />
              )}
            </FormItem>

            <div style={styles.sidewise}>
              <FormItem  label='Funds Source'>
                <Select placeholder="Funds Source" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="BMAC">BMAC</Option>
                  <Option value="CSFP">CSFP</Option>
                  <Option value="donation">Donation</Option>
                  <Option value="EFAP">EFAP</Option>
                  <Option value="EFAP FB">EFAP FB</Option>
                  <Option value="FEMA">FEMA</Option>
                  <Option value="gleanteam">Glean Team</Option>
                  <Option value="nonfederal">Non-Federal</Option>
                  <Option value="TEFAP">TEFAP</Option>
                  <Option value="unitedway">United Way</Option>
                  <Option value="other">Other</Option>
                </Select>
              </FormItem>

              <FormItem  label='Ship Via'>
                <Select label="Ship Via" placeholder="Ship Via" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="BMAC">BMAC</Option>
                  <Option value="customer">Customer</Option>
                  <Option value="other">Other</Option>
                </Select>
              </FormItem>
            </div>
            {formItems}
            <FormItem  label='Items Shipped'{...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>


            <div style={styles.sidewise}>
              <FormItem>
                {getFieldDecorator('rate', {
                  rules: [{ required: true, message: 'Please input the rate!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Rate" />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('billedamt', {
                  rules: [{ required: true, message: 'Please input the billed amount!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Billed Amount" />
                )}
              </FormItem>
            </div>

            <FormItem>
              {getFieldDecorator('rate', {
                rules: [{ required: true, message: 'Please input the rate!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Rate" />
              )}
            </FormItem>

            < div style={styles.container}>
              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="primary" htmlType="submit">Submit</Button>
              </FormItem>
            </div>

          </Form>}

      </div>
    );
  }
}


export default Form.create()(Forms);
