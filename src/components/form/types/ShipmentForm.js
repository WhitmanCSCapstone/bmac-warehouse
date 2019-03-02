import React from 'react';
import { db } from '../../../firebase';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Input, DatePicker, Select, Divider, Modal, Button } from 'antd';
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
    console.log(this.props.rowData)
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
  

  // @param 1 - Coordinate (in units declared at inception of PDF document) against left edge of the page
  // @param 2 - Coordinate (in units declared at inception of PDF document) against upper edge of the page
  // @param 3 - String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
  handlePdf = () => {
    const pdf = new jspdf();
    db.onceGetSpecificCustomer(this.state.customer_id).then( (customerObj) => {
      var customerName = customerObj.child('customer_id').val();
      var address = customerObj.child('address').val();
      var city = customerObj.child('city').val();
      var state = customerObj.child('state').val();
      var zip = customerObj.child('zip').val();
      var fullAddress = address + ', ' + city + ', ' + state + ', ' + zip;

      pdf.setFont('helvetica');
      pdf.setFontSize('20');
      pdf.setFontType('italic');
      pdf.text(40, 10, 'BMAC Shipment Invoice');
      pdf.text(55, 17.5, 'Blue Mountain Action Council');
      pdf.text(55, 25, 'Walla Walla, WA, 99362');

      pdf.setFontType('italic');
      pdf.setFontSize('12');
      pdf.text(10, 40, 'Invoice No:' + this.state.ship_date);
      pdf.text(10, 50, 'Ship Date: ' + this.state.ship_date);
      pdf.text(70, 50, 'Ship Via: ' + this.state.ship_via);
      pdf.text(130, 50, 'Funds Source: ' + this.state.funds_source);
      pdf.text(10, 65, 'Ship To: ');
      pdf.text(15, 75, customerName);
      pdf.text(15, 80, fullAddress);
      var clean_ship_items = this.deleteEmptyShipItems(this.state.ship_items);

      pdf.text(10, 90, 'Items Shipped:');
      pdf.setFontType('bold');
      pdf.text(30, 100, 'Product');
      pdf.text(90, 100, 'Unit Weight');
      pdf.text(115, 100, 'Case Lots');
      pdf.text(140, 100, 'Total Weight');
      pdf.setFontType('normal');
      var y = 105;
      var total_case_lots = 0, shipment_weight = 0;
      for (var i = 0; i < clean_ship_items.length; i++) {
        (clean_ship_items[i].product) ? pdf.text(30, y, String(clean_ship_items[i].product)) : pdf.text(30, y, "-");
        (clean_ship_items[i].unit_weight) ? pdf.text(90, y, String(clean_ship_items[i].unit_weight)) : pdf.text(90, y, "-");
        (clean_ship_items[i].case_lots) ? pdf.text(115, y, String(clean_ship_items[i].case_lots)) : pdf.text(115, y, "-");
        (clean_ship_items[i].total_weight) ? pdf.text(140, y, String(clean_ship_items[i].total_weight)) : pdf.text(140, y, "-");
        y += 5;
        total_case_lots += parseInt(clean_ship_items[i].case_lots);
        shipment_weight += parseInt(clean_ship_items[i].total_weight);
      }
      pdf.setFontType('bold');
      pdf.text(90, y+5, 'Totals: ');
      pdf.text(115, y+5, String(total_case_lots));
      pdf.text(140, y+5, String(shipment_weight));
      pdf.text(155, y+5, 'pounds');
      pdf.setFontType('normal');
      pdf.setFontType('italic');
      pdf.text(10, y+20, 'Rate: ' + this.state.ship_rate);
      pdf.text(70, y+20, 'Billed Amount: ' + this.state.total_price);
      pdf.text(10, y+30, 'Notes: ' + this.state.notes);
      pdf.text(10, y+50, 'BMAC Signature - ____________________________________________');
      pdf.text(10, y+60, 'Agency Signature - ___________________________________________');

      pdf.save('Receipt');
    },
    );
  }
  handleLabel = () => {

    const pdf = new jspdf();

    db.onceGetSpecificCustomer(this.state.customer_id).then( (customerObj) => {

      var customerName = customerObj.child('customer_id').val();
      var address = customerObj.child('address').val();
      var city = customerObj.child('city').val();
      var state = customerObj.child('state').val();
      var zip = customerObj.child('zip').val();
      var fullAddress = city + ', ' + state + ', ' + zip;

      pdf.setFont('Helvetica').setFontSize(28).setFontType('italic');
      pdf.text(10, 60, 'Ship To: ');
      pdf.text(50, 70, customerName);
      pdf.text(50, 80, address);
      pdf.text(50, 90, fullAddress);

      pdf.setFontSize(12).setFontType('normal');
      pdf.text(10, 110, 'Invoice no: ' + this.state.ship_date);
      pdf.text(130, 110, 'Funds Source: ' + this.state.funds_source);
      pdf.text(10, 120, 'Ship Date: ' + this.state.ship_date);
      pdf.text(70, 120, 'Ship Via: ' + this.state.ship_via);
      pdf.text(130, 120, "Total Weight: " + this.state.total_weight);

      pdf.save('Label');
    },
    );
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
          <Button key="savelabel" type="primary" onClick={this.handleLabel}>Create Label</Button>,
          <Button key="savepdf" type="primary" onClick={this.handlePdf}>Save Invoice</Button>,
          <Button key="delete" disabled={this.props.rowData ? false : true} type="danger" onClick={this.handleDelete}>Delete</Button>,
          <Button key="Cancel" onClick={this.props.onCancel}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>,
        ]}
      >

        <div id="divtoprint" style={styles.form}>

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
              />
            </div>


            <div style={styles.shipViaContainer}>
              Ship Via:
              <Select placeholder="Ship Via"
                      value={this.state.ship_via}
                      onChange={ (val) => {
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
