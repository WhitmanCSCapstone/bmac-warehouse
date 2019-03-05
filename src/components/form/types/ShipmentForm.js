import React from 'react';
import { db } from '../../../firebase';
import { Button, Input, DatePicker, Select, Divider, Modal } from 'antd';
import ProductItems from '../ProductItems';
import FundsSourceDropdownMenu from '../../../components/FundsSourceDropdownMenu';
import CustomerAutoComplete from '../CustomerAutoComplete';
import Moment from 'moment';

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

  defaultState = {
    customer_id: null,
    funds_source: null,
    invoice_date: 'null',
    invoice_no: 'null',
    notes: undefined,
    ship_date: null,
    ship_items: [{},{},{},{},{}],
    ship_rate: undefined,
    ship_via: undefined,
    total_price: undefined,
    total_weight: null,
    uniq_id: null,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.defaultState, ...props.rowData }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({ ...this.defaultState, ...this.props.rowData });
    }
  }

  onChange = (prop, val) => {
    this.setState({
      [prop]: val,
    })
  }

  onClickFundingSource = (value) => {
    this.setState({ funds_source: value });
  }

  clearFundingSource = () => {
    this.setState({ funds_source: null });
  }

  onTextChange = (prop, val) => {
    this.setState({ [prop]: val });
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
      var stringWeight = item ? item['total_weight'] : '0';
      var weight = parseInt(stringWeight);
      total_weight += isNaN(weight) ? 0 : weight;
    }
    this.setState({ total_weight: total_weight.toString() });
  }

  deleteEmptyShipItems = (shipItems) => {
    var filteredItems = shipItems.filter( obj => {
      return obj !== undefined && obj['product'] !== undefined;
    })
    return filteredItems;
  }

  handleOk = () => {
    this.props.onCancel();

    var emptiedShipItems = this.deleteEmptyShipItems(this.state.ship_items);
    var newData = JSON.parse(JSON.stringify(this.state));

    newData['ship_items'] = emptiedShipItems;

    var row = this.props.rowData

    if (row) {
      // if we are editing a shipment, set in place
      db.setShipmentObj(row.uniq_id, newData);
    } else {
      // else we are creating a new entry
      db.pushShipmentObj(newData);
    }

    // this only works if the push doesn't take too long, kinda sketch, should be made asynchronous
    this.props.refreshTable();

    this.setState({ ...this.defaultState });

  }

  addShipmentItem = () => {
    var emptyRow = {
      'product': undefined,
      'unit_weight': undefined,
      'case_lots': undefined,
      'total_weight': undefined,
    };

    var newShipItems = this.state.ship_items
                           .concat(emptyRow)
                           .filter( elem => {
                             return elem !== undefined;
                           });

    this.setState({ ship_items: newShipItems });
  }

  removeShipmentItem = (removeIndex) => {
    var itemsCopy = this.state.ship_items.filter( (obj, objIndex) => objIndex !== removeIndex )
    this.setState({ ship_items: itemsCopy });
  }

  handleDelete = () => {
    db.deleteShipmentObj(this.props.rowData.uniq_id);
    this.props.onCancel()
    this.props.refreshTable();
  }

  render() {

    return (

      <Modal
        title="Add New Shipment"
        style={{ top: 20 }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.formModalVisible}
        onCancel={this.props.onCancel}
        footer={[
          <Button key="delete" disabled={this.props.rowData ? false : true} type="danger" onClick={this.handleDelete}>Delete</Button>,
          <Button key="Cancel" onClick={this.props.onCancel}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>,
        ]}
      >

        <div style={styles.form}>

          <div style={styles.topThird}>

            <div style={styles.formItem}>
              Date:
              <DatePicker style={styles.datePicker}
                          onChange={ (date) => this.onChange('ship_date', date.format('MM/DD/YYYY')) }
                          format={'MM/DD/YYYY'}
                          key={`shipdate:${this.state.ship_date}`}
                          defaultValue={
                            this.state.ship_date
                                      ? Moment(this.state.ship_date, 'MM/DD/YYYY')
                                      : this.state.ship_date
                          }
                          placeholder="Ship Date" />
            </div>

            <div style={styles.formItem}>
              Customer:
              <CustomerAutoComplete
                onCustomerChange={ (val) => this.onChange('customer_id', val) }
                rowData={this.props.rowData}
              />
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
                rowData={this.props.rowData}
                key={`fundssource:${this.state.funds_source}`}
              />
            </div>


            <div style={styles.shipViaContainer}>
              Ship Via:
              <Select placeholder="Ship Via"
                      value={this.state.ship_via}
                      onChange={ (val) => {
                          console.log('val:', val);
                          this.onChange('ship_via', val)
                      } }>
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
                value={this.state.ship_rate}
                onChange={ (e) => this.onTextChange('ship_rate', e.target.value) }
              />
            </div>

            <div style={styles.formItem}>
              <Input
                placeholder="Billed Amount"
                value={this.state.total_price}
                onChange={ (e) => this.onTextChange('total_price', e.target.value) }
              />
            </div>

          </div>

          <TextArea
            rows={4}
            value={this.state.notes}
            placeholder="Notes"
            onChange={ (e) => this.onTextChange('notes', e.target.value) }
          />

        </div>

      </Modal>
    );
  }
}

export default ShipmentForm;
