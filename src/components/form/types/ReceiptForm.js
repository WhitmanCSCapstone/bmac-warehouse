import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Select, Divider, Modal } from 'antd';
import ProductItems from '../ProductItems';
import FundsSourceDropdownMenu from '../../../components/FundsSourceDropdownMenu';
import ProviderAutoComplete from '../ProviderAutoComplete';

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

class ReceiptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider_id: null,
      recieve_date: null,
      payment_source: null,
      receive_items: [{},{},{},{},{}],
      billed_amt: null,
      notes: null,
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

  onClickFundingSource = (value) => {
    this.setState({ payment_source: value });
  }

  clearPaymentSource = () => {
    this.setState({ payment_source: null });
  }

  onBilledAmtChange = (value) => {
    this.setState({ total_price: value })
  }

  onNotesChange = (value) => {
    this.setState({ notes: value })
  }

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.receive_items.slice(0); // shallow clone
    if(itemsCopy[index] === undefined) {
      itemsCopy[index] = {[prop]: val};
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ receive_items: itemsCopy });

    var total_weight = 0;
    for(var item of this.state.receive_items) {
      var weight = parseInt(item['total_weight'])
      total_weight += isNaN(weight) ? 0 : weight;
    }
    this.setState({ total_weight: total_weight.toString() });
  }

  deleteEmptyReceiveItems = () => {
    var newItems = [];
    for (let obj of this.state.receive_items){
      if (Object.keys(obj).length !== 0 && obj.constructor === Object){
        newItems.push(obj);
      }
    }
    this.setState({ receive_items: newItems });
  }

  handleOk = () => {
    this.props.onCancel();

    this.deleteEmptyReceiveItems();

    db.pushReceiptObj(this.state);

    // this only works if the push doesn't take too long, kinda sketch, should be made asynchronous
    this.props.refreshTable();

    this.setState({
      provider_id: null,
      recieve_date: null,
      payment_source: null,
      receive_items: [{},{},{},{},{}],
      billed_amt: null,
      notes: null,
      total_weight: null,
    });
  }

  addReceiveItem = () => {
    this.setState({ receive_items: [...this.state.receive_items, {}] });
  }

  removeReceiveItem = (removeIndex) => {
    var itemsCopy = this.state.receive_items.filter( (obj, objIndex) => objIndex !== removeIndex )
    this.setState({ receive_items: itemsCopy });
  }

  render() {

    return (

      <Modal
        title="Add New Receipt"
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
                          onChange={ (date) => this.onChange('recieve_date', date.format('YY-MM-DD:HH:mm')) }
                          placeholder="Receive Date" />
            </div>

            <div style={styles.formItem}>
              Payment Source:
              <FundsSourceDropdownMenu
                disabled={false}
                fundingSource={this.state.payment_source}
                style={styles.fundsSourceDropdown}
                onClick={this.onClickFundingSource}
                clearFundingSource={this.clearPaymentSource}
                required={true}
              />
            </div>


            <div style={styles.formItem}>
              Provider:
              <ProviderAutoComplete onProviderChange={ this.onChange }/>
            </div>

          </div>

          <Divider orientation="left">Receipt Items</Divider>


          {/* TODO make sure to change the props names that get passed down if you abstract it */}

          <ProductItems
            onChange={this.onItemsChange}
            items={this.state.receive_items}
            addProductItem={this.addReceiveItem}
            removeProductItem={this.removeReceiveItem}
          />

          <Divider />

          <div style={styles.bottomThird}>

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

export default ReceiptForm;
