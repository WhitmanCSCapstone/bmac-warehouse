import React from 'react';
import db from '../../firebase';
import { Form, Icon, Input, Button, DatePicker, Select, Divider } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

const Option = Select.Option;

const styles = {
  container: {
    // backgroundColor: 'teal',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'right',
    alignSelf: 'left',
    marginLeft: '5%',
  },

  addbutton: {
    display: 'flex',
  },

  sideways: {
    // backgroundColor : 'red',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  margin: {
    marginLeft: '5%',
  },

  item1: {
    flexGrow: '1',
  },

  form: {
    // backgroundColor: 'teal',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

  },

  button: {
    display: 'flex',
    alignSelf: 'center'
  },
};

var ref = null;

class Forms extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.row,
      formDisplayToggle: false,
      customerId: null,
      fundsSource: null,
      invoiceDate: null,
      invoiceNo: null,
      notes: null,
      shipDate: null,
      shipItems: [],
      shipRate: null,
      shipVia: null,
      totalPrice: null,
      totalWeight: null,
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

  onSubmit = () => {
    console.log(this.state)
  }

  onAddNewShipment = () => {
    this.setState({
      formDisplayToggle: !this.state.formDisplayToggle,
    })
  }

  onChange = (e, name) => {
    console.log('Received values of form: ', name, e.target.value);
    this.setState({
      [name]: e.target.value,
    })
  }

  dateChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      shipDate: dateString,
    })
  }

  handleShipChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      shipVia: value,
    })
  }

  handleFundsChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      fundsSource: value,
    })
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    console.log('look here')
    console.log(keys)
    const formItems = keys.map((k, index) => {
      return (
        <div key={k}
          style={styles.sideways}>
          <FormItem
            {...(styles.item)}
            required={false}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Please input values or delete this field.",
              }],
            })(
              <Input placeholder="Product Name" style={{ width: '80%', marginRight: 16 }}/>
            )}
          </FormItem>

          <FormItem {...styles.item1}
            required={false}>
            {getFieldDecorator('unitWeight')(
              <Input placeholder="Unit Weight" style={{ width: '60%', marginRight: 8 }} />
            )}
          </FormItem>

          <FormItem {...styles.item1}
            required={false}>
            {getFieldDecorator('caseLots')(
              <Input placeholder="Case Lots" style={{ width: '60%', marginRight: 8 }} />
            )}
          </FormItem>

          <FormItem {...styles.item1}
            required={false}>
            {getFieldDecorator('totalWeight')(
              <Input placeholder="Total Weight" style={{ width: '60%', marginRight: 8 }} />
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

        </div>
      );
    });

    return (
      <div style={styles.container}>

        {!this.state.formDisplayToggle ?
          <Button style={styles.button}
            onClick={this.onAddNewShipment}>
            Add New Shipment
          </Button>
          :
          <Button style={styles.button}
            onClick={this.onAddNewShipment}>
            Cancel Adding Shipment
        </Button>
        }

        {!this.state.formDisplayToggle ? null :
          <Form style={styles.form}>
            <FormItem>
            </FormItem>

            <FormItem label='Ship Date:'>
              {getFieldDecorator('shipDate', {
                rules: [{ required: true, message: 'Please input the shipping date.' }],
              })(
                <DatePicker onChange={this.dateChange} placeholder="Ship Date" />
              )}
            </FormItem>

            <FormItem label='Ship To:'>
              {getFieldDecorator('shipTo', {
                rules: [{ required: true, message: 'Please input the shipping destination.' }],
                onChange: (e) => this.onChange(e, 'shipTo')
              })(
                <Input style={{ width: 180 }} placeholder="Ship to:" />
              )}
            </FormItem>

            <div style={styles.sideways}>
              <FormItem label='Funds Source:'>
                {getFieldDecorator('fundsSource', {
                  rules: [{ required: true, message: 'Please input the Funding Source!' }],
                })(
                  <Select placeholder="Funds Source" style={{ width: 150 }} onChange={this.handleFundsChange}>
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
                )}

              </FormItem>
              <div style={styles.margin}>
                <FormItem label='Ship Via:'>
                  {getFieldDecorator('shipVia', {
                    rules: [{ required: true, message: 'Please input the shipping method!' }],
                  })(
                    <Select placeholder="Ship Via" style={{ width: 150, marginLeft: '5%' }} onChange={this.handleShipChange}>
                      <Option value="BMAC">BMAC</Option>
                      <Option value="customer">Customer</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  )}

                </FormItem>
              </div>
            </div>

            <Divider orientation="left">Ship Items</Divider>

            {formItems}


            <FormItem>
              <Button type="dashed" onClick={this.add} style={{ width: '20%' }}>
                <Icon type="plus" /> Add fields
              </Button>
            </FormItem>

            <Divider />

            <div style={styles.sideways}>
              <FormItem label='Rate:'>
                {getFieldDecorator('rate', {
                  rules: [{ required: true, message: 'Please input the rate!' }],
                  onChange: (e) => this.onChange(e, 'rate')
                })(
                  <Input style={{ width: 180 }} placeholder="Rate" />
                )}
              </FormItem>

              <div style={styles.margin}>
                <FormItem label='Billed Amount:'>
                  {getFieldDecorator('billedamt', {
                    rules: [{ required: true, message: 'Please input the billed amount!' }],
                    onChange: (e) => this.onChange(e, 'billedAmt')
                  })(
                    <Input style={{ width: 180, marginLeft: '5%' }} placeholder="Billed Amount" />
                  )}
                </FormItem>
              </div>
            </div>

            <FormItem label='Notes:'>
              {getFieldDecorator('notes', {
                rules: [{ required: true, message: 'Please input the billed amount!' }],
                onChange: (e) => this.onChange(e, 'notes')
              })(
                <TextArea rows={4} style={{ width: 400 }} placeholder="Notes" />
              )}

            </FormItem>

            < div style={styles.button}>
              <FormItem>
                <Button type="primary" htmlType="submit" onClick={this.onSubmit}>
                  Submit
                </Button>
              </FormItem>
            </div>

          </Form>}

      </div>
    );
  }
}

export default Form.create()(Forms);
