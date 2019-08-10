import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Divider, Modal, Form } from 'antd';
import {
  getCombinedWeight,
  hasErrors,
  generateGenericFormItem,
  deleteEmptyProductItems
} from '../../../utils/misc.js';
import { handleReceiptClick } from './pdfUtils';
import ProductItems from '../ProductItems';
import Footer from '../Footer';
import FundsSourceDropdown from '../FundsSourceDropdown.js';
import ProviderAutoComplete from '../ProviderAutoComplete';
import Moment from 'moment';
import { styles } from './styles';

const { TextArea } = Input;

class ReceiptForm extends React.Component {
  defaultState = {
    provider_id: null,
    recieve_date: null,
    payment_source: null,
    receive_items: [{}, {}, {}, {}, {}],
    billed_amt: null,
    notes: null,
    total_weight: null,
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

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.receive_items.slice(0); // shallow clone
    if (!itemsCopy[index]) {
      itemsCopy[index] = { [prop]: val };
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ receive_items: itemsCopy });

    const totalWeight = getCombinedWeight(this.state.receive_items);
    this.setState({ total_weight: totalWeight.toString() });
  };

  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var emptiedShipItems = deleteEmptyProductItems(this.state.receive_items);
        var newData = JSON.parse(JSON.stringify(this.state));

        newData['receive_items'] = emptiedShipItems;

        var row = this.props.rowData;
        const callback = () => this.props.refreshTable(this.props.closeModal);

        if (row && row.uniq_id) {
          // if we are editing a shipment, set in place
          db.setReceiptObj(row.uniq_id, newData, callback);
        } else {
          // else we are creating a new entry
          db.pushReceiptObj(newData, callback);
        }
      }
    });
  };

  addReceiveItem = () => {
    var emptyRow = {
      product: null,
      material_number: null,
      unit_weight: null,
      case_lots: null,
      total_weight: null
    };

    var newReceiveItems = this.state.receive_items.concat(emptyRow).filter(elem => {
      return elem !== undefined;
    });

    this.setState({ receive_items: newReceiveItems });
  };

  removeReceiveItem = removeIndex => {
    var itemsCopy = this.state.receive_items.filter((obj, objIndex) => objIndex !== removeIndex);
    this.setState({ receive_items: itemsCopy });
  };

  handleDelete = showLoadingAnimation => {
    showLoadingAnimation();
    const callback = () => this.props.refreshTable(this.props.closeModal);
    db.deleteReceiptObj(this.props.rowData.uniq_id, callback);
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;
    return (
      <Modal
        title={'Receipt Form'}
        style={{ top: 20 }}
        width={'60vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        afterClose={this.props.closeForm}
        onCancel={this.props.closeModal}
        footer={[
          <Footer
            key={'footer'}
            rowData={this.props.rowData}
            handleDelete={this.handleDelete}
            handleReceiptClick={() =>
              handleReceiptClick(
                this.state,
                this.props.providers,
                this.props.products,
                this.props.fundingSources
              )
            }
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
            saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError())}
          />
        ]}
      >
        <Form layout={'vertical'} style={styles.form}>
          <Form.Item style={styles.formItem} label={'Receive Date:'}>
            {getFieldDecorator('recieve_date', {
              initialValue: this.state.recieve_date
                ? Moment.unix(this.state.recieve_date)
                : undefined,
              rules: [{ type: 'object', required: true, message: 'Please Enter A Receive Date' }]
            })(
              <DatePicker
                style={styles.datePicker}
                onChange={date => this.onChange('recieve_date', Number(date.format('X')))}
                placeholder={'Receive Date'}
                format={'MM/DD/YYYY'}
                allowClear={false}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Provider Name:'}>
            {getFieldDecorator('provider_id', {
              initialValue: this.state.provider_id,
              rules: [
                {
                  whitespace: true,
                  type: 'enum',
                  enum: Object.keys(this.props.providers),
                  required: true,
                  message: 'Please Enter A Valid Provider'
                }
              ]
            })(
              <ProviderAutoComplete
                onChange={val => this.onChange('provider_id', val)}
                rowData={this.props.rowData}
              />
            )}
          </Form.Item>

          <Form.Item style={styles.formItem} label={'Payment Source:'}>
            {getFieldDecorator('status', {
              initialValue: this.state.payment_source,
              rules: [{ required: true, message: 'Please Enter A Payment Source' }]
            })(
              <FundsSourceDropdown
                onChange={val => this.onChange('payment_source', val)}
                fundingSources={this.props.fundingSources}
              />
            )}
          </Form.Item>

          <Divider orientation="left">Receipt Items</Divider>

          {/* TODO make sure to change the props names that get passed down if you abstract it */}

          <ProductItems
            onChange={this.onItemsChange}
            items={this.state.receive_items}
            fundingSources={this.props.fundingSources}
            products={this.props.products}
            fundsSource={
              this.state.payment_source
                ? this.state.payment_source
                : this.props.rowData
                ? this.props.rowData['payment_source']
                : null
            }
            addProductItem={this.addReceiveItem}
            removeProductItem={this.removeReceiveItem}
            getFieldDecorator={getFieldDecorator}
            validateFields={this.props.form.validateFieldsAndScroll}
          />

          <Divider />

          {['billed_amt'].map(accessor => {
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

const WrappedReceiptForm = Form.create({ name: 'ReceiptForm' })(ReceiptForm);

export default WrappedReceiptForm;
