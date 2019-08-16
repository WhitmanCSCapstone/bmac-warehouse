import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Select, Divider, Modal, Form, AutoComplete } from 'antd';
import { handleLabelClick, handleInvoiceClick } from './pdfUtils';
import {
  getCombinedWeight,
  hasErrors,
  generateGenericFormItem,
  deleteEmptyProductItems,
  getActiveObjKeys,
  getRelevantCustomers
} from '../../../utils/misc.js';
import ProductItems from '../ProductItems';
import Footer from '../Footer';
import FundsSourceDropdown from '../FundsSourceDropdown.js';
import Moment from 'moment';
import { styles } from './styles';

const { TextArea } = Input;

const Option = Select.Option;

class ShipmentForm extends React.Component {
  defaultState = {
    customer_id: null,
    funds_source: null,
    invoice_date: null,
    invoice_no: null,
    notes: null,
    ship_date: null,
    ship_items: [{}, {}, {}, {}, {}],
    ship_rate: null,
    ship_via: null,
    total_price: null,
    total_weight: null,
    uniq_id: null
  };

  constructor(props) {
    super(props);
    this.state = { ...this.defaultState, ...props.rowData };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({ ...this.defaultState, ...this.props.rowData });
    } else if (
      this.state.funds_source !== prevState.funds_source &&
      this.state.ship_items[0].product
    ) {
      let count = 0;
      const fields = this.state.ship_items.map(() => `product_id${count++}`);
      this.props.form.validateFieldsAndScroll(fields);
    }
  }

  onChange = (prop, val) => {
    this.setState({
      [prop]: val
    });
  };

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.ship_items.slice(0); // shallow clone
    if (!itemsCopy[index]) {
      itemsCopy[index] = { [prop]: val };
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ ship_items: itemsCopy });

    const totalWeight = getCombinedWeight(this.state.ship_items);
    this.setState({ total_weight: totalWeight.toString() });
  };

  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var emptiedShipItems = deleteEmptyProductItems(this.state.ship_items);
        var newData = JSON.parse(JSON.stringify(this.state));

        newData['ship_items'] = emptiedShipItems;

        var row = this.props.rowData;
        const callback = () => this.props.refreshTable(this.props.closeModal);

        if (row && row.uniq_id) {
          // if we are editing a shipment, set in place
          db.setShipmentObj(row.uniq_id, newData, callback);
        } else {
          // else we are creating a new entry
          db.pushShipmentObj(newData, callback);
        }
      }
    });
  };

  addShipmentItem = () => {
    var emptyRow = {
      product: null,
      material_number: null,
      unit_weight: null,
      case_lots: null,
      total_weight: null
    };

    var newShipItems = this.state.ship_items.concat(emptyRow).filter(elem => {
      return elem !== undefined;
    });

    this.setState({ ship_items: newShipItems });
  };

  removeShipmentItem = removeIndex => {
    var itemsCopy = this.state.ship_items.filter((obj, objIndex) => objIndex !== removeIndex);
    this.setState({ ship_items: itemsCopy });
  };

  handleDelete = showLoadingAnimation => {
    showLoadingAnimation();
    const callback = () => this.props.refreshTable(this.props.closeModal);
    db.deleteShipmentObj(this.props.rowData.uniq_id, callback);
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;
    const relevantCustomers = getRelevantCustomers(this.props.customers, this.state.customer_id);
    const validCustomerKeys = getActiveObjKeys(this.props.customers);

    return (
      <Modal
        title={'Shipment Form'}
        style={{ top: 20 }}
        width={'60vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key={'footer'}
            handleLabelClick={() =>
              handleLabelClick(this.state, this.props.customers, this.props.fundingSources)
            }
            handleInvoiceClick={() =>
              handleInvoiceClick(
                this.state,
                this.props.customers,
                this.props.products,
                this.props.fundingSources
              )
            }
            rowData={this.props.rowData}
            handleDelete={this.handleDelete}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
            saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError())}
          />
        ]}
      >
        <Form layout={'vertical'} style={styles.form}>
          <Form.Item style={styles.formItem} label={'Ship Date:'}>
            {getFieldDecorator('ship_date', {
              initialValue: this.state.ship_date ? Moment.unix(this.state.ship_date) : undefined,
              rules: [{ type: 'object', required: true, message: 'Please Enter A Ship Date' }]
            })(
              <DatePicker
                style={styles.datePicker}
                onChange={date => this.onChange('ship_date', Number(date.format('X')))}
                placeholder={'Ship Date'}
                format={'MM/DD/YYYY'}
                allowClear={false}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Customer Name:'}>
            {getFieldDecorator('customer_id', {
              initialValue: this.state.customer_id,
              rules: [
                {
                  whitespace: true,
                  type: 'enum',
                  enum: validCustomerKeys,
                  required: true,
                  message: 'Please Enter A Valid Customer'
                }
              ]
            })(
              <AutoComplete
                dataSource={relevantCustomers}
                onChange={val => this.onChange('customer_id', val)}
                placeholder="Customer"
                filterOption={(inputValue, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    );
                  }
                }}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Funding Source:'}>
            {getFieldDecorator('status', {
              initialValue: this.state.funds_source,
              rules: [{ required: true, message: 'Please Enter A Funding Source' }]
            })(
              <FundsSourceDropdown
                onChange={val => this.onChange('funds_source', val)}
                fundingSources={this.props.fundingSources}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Ship Via:'}>
            {getFieldDecorator('ship_via', {
              initialValue: this.state.ship_via ? this.state.ship_via : undefined,
              rules: [{ required: true, message: 'Please Select A Ship Via' }]
            })(
              <Select
                placeholder={'Ship Via'}
                onChange={val => {
                  this.onChange('ship_via', val);
                }}
              >
                <Option value="BMAC">BMAC</Option>
                <Option value="Customer">Customer</Option>
                <Option value="Other">Other</Option>
              </Select>
            )}
          </Form.Item>

          <Divider orientation="left">Ship Items</Divider>

          <ProductItems
            onChange={this.onItemsChange}
            items={this.state.ship_items}
            fundingSources={this.props.fundingSources}
            products={this.props.products}
            fundsSource={
              this.state.funds_source
                ? this.state.funds_source
                : this.props.rowData
                ? this.props.rowData['funds_source']
                : null
            }
            addProductItem={this.addShipmentItem}
            removeProductItem={this.removeShipmentItem}
            getFieldDecorator={getFieldDecorator}
          />

          <Divider />

          {['ship_rate', 'total_price'].map(accessor => {
            return generateGenericFormItem(
              accessor,
              this.state[accessor],
              val => this.onChange(accessor, val),
              getFieldDecorator,
              'number'
            );
          })}

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

const WrappedShipmentForm = Form.create({ name: 'ShipmentForm' })(ShipmentForm);

export default WrappedShipmentForm;
