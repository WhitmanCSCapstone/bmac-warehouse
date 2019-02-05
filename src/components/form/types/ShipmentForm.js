import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Select, Divider, Modal } from 'antd';
import ProductItems from '../ProductItems';
import FundsSourceDropdownMenu from '../../../components/FundsSourceDropdownMenu';
import CustomerAutoComplete from '../CustomerAutoComplete';

const { TextArea } = Input;

const Option = Select.Option;

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  formItem: {
    width: '45%',
    margin: '0px 1em 1em 1em',
  },

  datePicker: {
    width: '100%',
  },

  topThird: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'center',
  },

  bottomThird: {
    display: 'flex',
    justifyContent: 'flex-start',
  },

  shipViaContainer: {
    width: '45%',
    margin: '0px 1em 1em 1em',
    display: 'flex',
    flexDirection: 'column',
  },
};

var ref = null;

class ShipmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_id: null,
      funds_source: null,
      invoice_date: 'null',
      invoice_no: 'null',
      notes: null,
      ship_date: null,
      ship_items: [{},{},{},{},{}],
      ship_rate: null,
      ship_via: null,
      total_price: null,
      total_weight: null,
    }
  }

  onChange = (prop, val) => {
    console.log('Received values of form: ', val, prop);
    this.setState({
      [prop]: val,
    })
  }

  // TODO: DRY using this

  onCustomerChange = (value) => {
    this.setState({ customer_id: value })
  }

  onClickFundingSource = (value) => {
    this.setState({ funds_source: value });
  }

  clearFundingSource = () => {
    this.setState({ funds_source: null });
  }

  onShipViaChange = (value) => {
    this.setState({ ship_via: value })
  }

  onRateChange = (value) => {
    this.setState({ ship_rate: value })
  }

  onBilledAmtChange = (value) => {
    this.setState({ total_price: value })
  }

  onNotesChange = (value) => {
    this.setState({ notes: value })
  }

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.ship_items.slice(0); // shallow clone
    if(itemsCopy[index] === undefined) {
      itemsCopy[index] = {[prop]: val};
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ ship_items: itemsCopy });

    var total_weight = 0;
    for(var item of this.state.ship_items) {
      var weight = parseInt(item['total_weight'])
      total_weight += isNaN(weight) ? 0 : weight;
    }
    this.setState({ total_weight: total_weight.toString() });
  }

  deleteEmptyShipItems = () => {
    var newItems = [];
    for (let obj of this.state.ship_items){
      if (Object.keys(obj).length !== 0 && obj.constructor === Object){
        newItems.push(obj);
      }
    }
    this.setState({ ship_items: newItems });
  }

  handleOk = () => {
    this.props.onCancel();

    this.deleteEmptyShipItems();

    db.pushShipmentObj(this.state);

    // this only works if the push doesn't take too long, kinda sketch, should be made asynchronous
    this.props.refreshTable();

    this.setState({
      customer_id: null,
      funds_source: null,
      invoice_date: 'null',
      invoice_no: 'null',
      notes: null,
      ship_date: null,
      ship_items: [{},{},{},{},{}],
      ship_rate: null,
      ship_via: null,
      total_price: null,
      total_weight: null,
    });

  }

  addShipmentItem = () => {
    this.setState({ ship_items: [...this.state.ship_items, {}] });
  }

  removeShipmentItem = (removeIndex) => {
    var itemsCopy = this.state.ship_items.filter( (obj, objIndex) => objIndex != removeIndex )
    this.setState({ ship_items: itemsCopy });
  }

  render() {

    return (

      <Modal
        title="Add New Shipment"
        style={{ top: 20 }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.formModalVisible}
        okText='Submit'
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
      >

        <div style={styles.form}>

          <div style={styles.topThird}>

            <div style={styles.formItem}>
              Date:
              <DatePicker style={styles.datePicker}
                          onChange={ (date) => this.onChange('ship_date', date.format('YY-MM-DD:HH:mm')) }
                          placeholder="Ship Date" />
            </div>

            <div style={styles.formItem}>
              Customer:
              <CustomerAutoComplete onCustomerChange={ (val) => this.onCustomerChange(val) }/>
            </div>

            <div style={styles.formItem}>
              Funding Source:
              <FundsSourceDropdownMenu
                disabled={false}
                fundingSource={this.state.funds_source}
                style={styles.fundsSourceDropdown}
                onClick={this.onClickFundingSource}
                clearFundingSource={this.clearFundingSource}
                required={true}
              />
            </div>


            <div style={styles.shipViaContainer}>
              Ship Via:
              <Select placeholder="Ship Via"
                      onChange={this.onShipViaChange}>
                <Option value="BMAC">BMAC</Option>
                <Option value="Customer">Customer</Option>
                <Option value="Other">Other</Option>
              </Select>

            </div>

          </div>

          <Divider orientation="left">Ship Items</Divider>

          <ProductItems
            onChange={this.onItemsChange}
            items={this.state.ship_items}
            addProductItem={this.addShipmentItem}
            removeProductItem={this.removeShipmentItem}
          />

          <Divider />

          <div style={styles.bottomThird}>

            <div style={styles.formItem}>
              <Input
                placeholder="Rate"
                onChange={ (e) => this.onRateChange(e.target.value) }/>
            </div>

            <div style={styles.formItem}>
              <Input
                placeholder="Billed Amount"
                onChange={ (e) => this.onBilledAmtChange(e.target.value) } />
            </div>

          </div>

          <TextArea
            rows={4}
            placeholder="Notes"
            onChange={ (e) => this.onNotesChange(e.target.value) }
          />

        </div>

      </Modal>
    );
  }
}

export default ShipmentForm;
