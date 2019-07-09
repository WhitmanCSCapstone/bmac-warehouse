import React from 'react';
import { db } from '../../../firebase';
import { Input, DatePicker, Divider, Modal } from 'antd';
import { getCombinedWeight } from '../../../utils/misc.js';
import { handleReceiptClick, deleteEmptyProductItems } from './pdfUtils';
import ProductItems from '../ProductItems';
import Footer from '../Footer';
import FundsSourceAutoComplete from '../FundsSourceAutoComplete';
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

  onItemsChange = (prop, index, val) => {
    var itemsCopy = this.state.receive_items.slice(0); // shallow clone
    if (itemsCopy[index] === undefined) {
      itemsCopy[index] = { [prop]: val };
    } else {
      itemsCopy[index][prop] = val;
    }
    this.setState({ receive_items: itemsCopy });

    const totalWeight = getCombinedWeight(this.state.receive_items);
    this.setState({ total_weight: totalWeight.toString() });
  };

  handleOk = () => {
    var emptiedShipItems = deleteEmptyProductItems(this.state.receive_items);
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
    this.props.refreshTable(() => {
      this.props.closeForm();
      this.setState({ ...this.defaultState });
    });
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
    this.props.refreshTable(this.props.closeForm);
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
            handleReceiptClick={() => handleReceiptClick(this.state)}
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
                onChange={date => this.onChange('recieve_date', Number(date.format('X')))}
                format={'MM/DD/YYYY'}
                key={`recievedate:${this.state.recieve_date}`}
                defaultValue={
                  this.state.recieve_date
                    ? Moment.unix(this.state.recieve_date)
                    : this.state.recieve_date
                }
                placeholder="Receive Date"
              />
            </div>

            <div style={styles.formItem}>
              Payment Source:
              <FundsSourceAutoComplete
                onFundsSourceChange={val => this.onChange('funds_source', val)}
                accessor={'payment_source'}
                rowData={this.props.rowData}
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
            fundsSource={this.props.rowData ? this.props.rowData['payment_source'] : null}
            addProductItem={this.addReceiveItem}
            removeProductItem={this.removeReceiveItem}
          />

          <Divider />

          <div style={styles.bottomThird}>
            <div style={styles.formItem}>
              <Input
                placeholder="Billed Amount"
                value={this.state.billed_amt}
                onChange={e => this.onChange('billed_amt', e.target.value)}
              />
            </div>
          </div>

          <TextArea
            rows={4}
            placeholder="Notes"
            value={this.state.notes}
            onChange={e => this.onChange('notes', e.target.value)}
          />
        </div>
      </Modal>
    );
  }
}

export default ReceiptForm;
