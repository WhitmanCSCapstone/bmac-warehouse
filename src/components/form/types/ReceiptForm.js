import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Divider, Modal } from 'antd';
import ProductItems from '../ProductItems';
import Footer from '../Footer';
import FundsSourceDropdownMenu from '../../../components/FundsSourceDropdownMenu';
import ProviderAutoComplete from '../ProviderAutoComplete';
import Moment from 'moment';

const { TextArea } = Input;

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  formItem: {
    width: '45%',
    margin: '0px 1em 1em 1em'
  },

  datePicker: {
    width: '100%'
  },

  topThird: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'center'
  },

  bottomThird: {
    display: 'flex',
    justifyContent: 'flex-start'
  },

  shipViaContainer: {
    width: '45%',
    margin: '0px 1em 1em 1em',
    display: 'flex',
    flexDirection: 'column'
  }
};

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

  onChange = (prop, val) => {
    this.setState({
      [prop]: val
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({ ...this.props.rowData });
    }
  }

  onClickFundingSource = value => {
    this.setState({ payment_source: value });
  };

  clearPaymentSource = () => {
    this.setState({ payment_source: null });
  };

  onTextChange = (prop, val) => {
    this.setState({ [prop]: val });
  };

  onNotesChange = value => {
    this.setState({ notes: value });
  };

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.receive_items.slice(0); // shallow clone
    if (itemsCopy[index] === undefined) {
      itemsCopy[index] = { [prop]: val };
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ receive_items: itemsCopy });

    var total_weight = 0;
    for (var item of this.state.receive_items) {
      var stringWeight = item ? item['total_weight'] : '0';
      var weight = parseInt(stringWeight);
      total_weight += isNaN(weight) ? 0 : weight;
    }
    this.setState({ total_weight: total_weight.toString() });
  };

  deleteEmptyReceiveItems = receiveItems => {
    var filteredItems = receiveItems.filter(obj => {
      return obj !== undefined && obj['product'] !== undefined;
    });
    return filteredItems;
  };

  handleOk = () => {
    var emptiedShipItems = this.deleteEmptyReceiveItems(this.state.receive_items);
    var newData = JSON.parse(JSON.stringify(this.state));

    newData['receive_items'] = emptiedShipItems;

    var row = this.props.rowData;

    if (row && row.uniq_id) {
      // if we are editing a shipment, set in place
      db.setReceiptObj(row.uniq_id, newData);
    } else {
      // else we are creating a new entry
      db.pushReceiptObj(newData);
    }

    // this only works if the push doesn't take too long, kinda sketch, should be made asynchronous
    this.props.refreshTable();

    setTimeout(() => {
      this.props.closeForm();
      this.setState({ ...this.defaultState });
    }, 1500);
  };

  addReceiveItem = () => {
    var emptyRow = {
      product: undefined,
      unit_weight: undefined,
      case_lots: undefined,
      total_weight: undefined
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

  handleDelete = () => {
    db.deleteReceiptObj(this.props.rowData.uniq_id);
    this.props.closeForm();
    this.props.refreshTable();
  };

  render() {
    return (
      <Modal
        title="Receipt Form"
        style={{ top: 20 }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.formModalVisible}
        onCancel={this.props.closeForm}
        footer={[
          <Footer
            key="footer"
            rowData={this.props.rowData}
            handleDelete={this.handleDelete}
            closeForm={this.props.closeForm}
            handleOk={this.handleOk}
          />
        ]}
      >
        <div style={styles.form}>
          <div style={styles.topThird}>
            {/* intentially mispelled "receive" */}
            <div style={styles.formItem}>
              Date:
              <DatePicker
                style={styles.datePicker}
                onChange={date => this.onChange('recieve_date', date.format('MM/DD/YYYY'))}
                format={'MM/DD/YYYY'}
                key={`recievedate:${this.state.recieve_date}`}
                defaultValue={
                  this.state.recieve_date
                    ? Moment(this.state.recieve_date, 'MM/DD/YYYY')
                    : this.state.recieve_date
                }
                placeholder="Receive Date"
              />
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
                rowData={this.props.rowData}
                key={`paymentsource:${this.state.payment_source}`}
              />
            </div>

            <div style={styles.formItem}>
              Provider:
              <ProviderAutoComplete
                onProviderChange={val => this.onChange('provider_id', val)}
                rowData={this.props.rowData}
              />
            </div>
          </div>

          <Divider orientation="left">Receipt Items</Divider>

          {/* TODO make sure to change the props names that get passed down if you abstract it */}

          <ProductItems
            onChange={this.onItemsChange}
            items={this.state.receive_items}
            fundsSource={this.props.rowData ? this.props.rowData['funds_source'] : null}
            addProductItem={this.addReceiveItem}
            removeProductItem={this.removeReceiveItem}
          />

          <Divider />

          <div style={styles.bottomThird}>
            <div style={styles.formItem}>
              <Input
                placeholder="Billed Amount"
                value={this.state.billed_amt}
                onChange={e => this.onTextChange('billed_amt', e.target.value)}
              />
            </div>
          </div>

          <TextArea
            rows={4}
            placeholder="Notes"
            value={this.state.notes}
            onChange={e => this.onTextChange('notes', e.target.value)}
          />
        </div>
      </Modal>
    );
  }
}

export default ReceiptForm;
