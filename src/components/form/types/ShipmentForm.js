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

// const pdf = new jspdf();

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
  

  // @param 1 - Coordinate (in units declared at inception of PDF document) against left edge of the page
  // @param 2 - Coordinate (in units declared at inception of PDF document) against upper edge of the page
  // @param 3 - String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
  handlePdf = () => {
    console.log("Test");
    // const input = document.getElementById('divtoprint');
    // html2canvas(input)
    // .then((canvas) => {
    //   const canvasImage = canvas.toDataURL('image/png');
    //   pdf.addImage(canvasImage, 'JPEG', 5, 5, 205, 292);
    //   pdf.save("download.pdf");
    // })

    console.log('hello')
    const pdf = new jspdf();
    db.onceGetSpecificCustomer(this.state.customer_id).then( (customerObj) => {
      // var name = customerObj['customer_id'];
      // var address = customerObj
      console.log(customerObj);
      // var customerName = customerObj['customer_id'];
      var customerName = customerObj.child('customer_id').val();
      var address = customerObj.child('address').val();
      var city = customerObj.child('city').val();
      var state = customerObj.child('state').val();
      var zip = customerObj.child('zip').val();
      var fullAddress = address + ', ' + city + ', ' + state + ', ' + zip;

      console.log(this.state.customer_id);
      console.log(customerName, fullAddress);

      pdf.setFont('helvetica');
      pdf.setFontSize('12');
      pdf.text(10, 10, `Sample PDF`);
      pdf.text(10, 15, 'Invoice No:');
      pdf.text(10, 20, 'Ship Date: ' + this.state.ship_date);
      pdf.text(70, 20, 'Ship Via: ' + this.state.ship_via);
      pdf.text(130, 20, 'Funds Source: ' + this.state.funds_source);
      pdf.text(10, 40, 'Ship To: ');
      pdf.text(15, 45, customerName);
      pdf.text(15, 50, fullAddress);
      pdf.text(15, 60, 'Items Shipped:');
      pdf.text(30, 70, String(this.state.ship_items));

      pdf.text(10, 180, 'Rate: ' + this.state.ship_rate);
      pdf.text(70, 180, 'Billed Amount: ' + this.state.total_price);
      pdf.text(10, 185, 'Notes: ' + this.state.notes);
      pdf.text(10, 200, 'BMAC Signature - ____________________________________________');
      pdf.text(10, 210, 'Agency Signature - ___________________________________________');

      pdf.save('Receipt');
    },
    );
    // pdf.text(15, 45, '' + );
    // save the PDF document (downloadable)


    // //adds the image to the pdf as a Data URL
    // var imgdata = 'data:image/jpeg;base64,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'

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

      pdf.setFont('Helvetica').setFontSize(32).setFontType('italic');
      pdf.text(10, 60, 'Ship To: ');
      pdf.text(50, 70, customerName);
      pdf.text(50, 80, address);
      pdf.text(50, 90, fullAddress);
      console.log(customerName);

      pdf.setFontSize(12).setFontType('normal');
      pdf.text(10, 110, 'Invoice no: ' + this.state.invoice_no);
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
