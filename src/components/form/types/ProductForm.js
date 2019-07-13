import React from 'react';
import { db } from '../../../firebase';
import { Input, Select, Divider, Modal, DatePicker } from 'antd';
import FundsSourceAutoComplete from '../FundsSourceAutoComplete';
import Moment from 'moment';
import Footer from '../Footer';

//This is for the notes section.
const { TextArea } = Input;
//This is for the status dropdown.
const Option = Select.Option;

//Styles
const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
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
  }
};

//Provider Form Component
class ProductForm extends React.Component {
  defaultState = {
    product_id: null,
    material_number: null,
    funding_source: null,
    unit_weight: null,
    unit_price: null,
    initial_date: null,
    initial_stock: null,
    minimum_stock: null,
    history: null,
    current_stock: null,
    inventory_date: null,
    status: null,
    uniq_id: null,
    notes: null
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

  onTextChange = (prop, val) => {
    this.setState({ [prop]: val });
  };

  //Used to send the data to the databsae and reset the state.
  handleOk = () => {
    var newData = JSON.parse(JSON.stringify(this.state));
    var row = this.props.rowData;

    if (row && row.uniq_id) {
      // if we are editing a shipment, set in place
      db.setProductObj(row.uniq_id, newData);
    } else {
      // else we are creating a new entry
      db.pushProductObj(newData);
    }

    // this only works if the push doesn't take too long, kinda sketch, should be
    // made asynchronous
    this.props.refreshTable(() => {
      this.props.closeForm();
      this.setState({ ...this.defaultState });
    });
  };

  handleDelete = () => {
    db.deleteProductObj(this.props.rowData.uniq_id);
    this.props.refreshTable(this.props.closeForm);
  };

  render() {
    return (
      <Modal
        title="Product Form"
        style={{
          top: 20
        }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.formModalVisible}
        okText="Submit"
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
          <div style={styles.formItem}>
            Product Name:
            <Input
              value={this.state.product_id}
              placeholder="Product Name"
              onChange={e => this.onChange('product_id', e.target.value)}
            />
          </div>
          <div style={styles.formItem}>
            Material Number:
            <Input
              value={this.state.material_number}
              placeholder="Material Number"
              onChange={e => this.onChange('material_number', e.target.value)}
            />
          </div>
          <Divider orientation="left">Product Information</Divider>
          <div style={styles.topThird}>
            <div style={styles.formItem}>
              Funding Source:
              <FundsSourceAutoComplete
                onFundsSourceChange={val => this.onChange('funds_source', val)}
                accessor={'funding_source'}
                rowData={this.props.rowData}
                fundingSources={this.props.fundingSources}
              />
            </div>

            <div style={styles.formItem}>
              Unit Weight:
              <Input
                value={this.state.unit_weight}
                placeholder="Unit Weight"
                onChange={e => this.onChange('unit_weight', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Unit Price:
              <Input
                value={this.state.unit_price}
                placeholder="Unit Price"
                onChange={e => this.onChange('unit_price', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Initial Stock:
              <Input
                value={this.state.initial_stock}
                placeholder="Initial Stock"
                onChange={e => this.onChange('initial_stock', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Initial Date:
              <DatePicker
                style={styles.datePicker}
                onChange={date => this.onChange('initial_date', Number(date.format('X')))}
                placeholder="Initial Date"
                format={'MM/DD/YYYY'}
                allowClear={false}
                key={`initialdate:${this.state.initial_date}`}
                defaultValue={
                  this.state.initial_date ? Moment.unix(this.state.initial_date) : undefined
                }
              />
            </div>
            <div style={styles.formItem}>
              Minimum Stock:
              <Input
                value={this.state.minimum_stock}
                placeholder="Initial Stock"
                onChange={e => this.onChange('minimum_stock', e.target.value)}
              />
            </div>
          </div>
          <Divider />
          Status:
          <Select
            placeholder="Status"
            style={{
              width: 120
            }}
            onChange={value => this.onChange('status', value)}
            value={this.state.status}
          >
            <Option value="active">Active</Option>
            <Option value="discontinued">Discontinued</Option>
          </Select>
          <div style={styles.bottomThird}>
            <div style={styles.formItem} />
          </div>
          <TextArea
            value={this.state.notes}
            rows={4}
            placeholder="Notes"
            onChange={e => this.onChange('notes', e.target.value)}
          />
        </div>
      </Modal>
    );
  }
}

export default ProductForm;
