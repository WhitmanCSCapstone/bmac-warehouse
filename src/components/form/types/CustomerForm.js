import React from 'react';
import { db } from '../../../firebase';
import { Input, Select, Divider, Modal } from 'antd';
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
    justifyContent: 'center'
  },

  formItem: {
    width: '45%',
    margin: '0px 1em 1em 1em'
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
    justifyContent: 'flex-start',
    alignContent: 'center'
  }
};

class CustomerForm extends React.Component {
  defaultState = {
    customer_id: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    county: null,
    contact: null,
    phone: null,
    email: null,
    status: null,
    notes: null,
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

  onStatusChange = value => {
    this.setState({ status: value });
  };

  //Ok Click
  handleOk = () => {
    var newData = JSON.parse(JSON.stringify(this.state));

    var row = this.props.rowData;

    if (row && row.uniq_id) {
      db.setCustomerObj(row.uniq_id, newData);
    } else {
      db.pushCustomerObj(this.state);
    }

    // this only works if the push doesn't take too long, kinda sketch, should be
    // made asynchronous

    this.props.refreshTable(() => {
      this.props.closeModal();
    });
  };

  render() {
    return (
      <Modal
        title="Customer Form"
        style={{ top: 20 }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key="footer"
            rowData={this.props.rowData}
            handleDelete={this.handleDelete}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
          />
        ]}
      >
        <div style={styles.form}>
          <div style={styles.topThird}>
            <div style={styles.formItem}>
              Customer Name:
              <Input
                placeholder="Customer Name"
                onChange={e => this.onChange('customer_id', e.target.value)}
                value={this.state.customer_id}
              />
            </div>

            <Divider orientation="left">Customer Information</Divider>

            <div style={styles.formItem}>
              Address:
              <Input
                placeholder="Address"
                onChange={e => this.onChange('address', e.target.value)}
                value={this.state.address}
              />
            </div>

            <div style={styles.formItem}>
              City:
              <Input
                placeholder="City"
                onChange={e => this.onChange('city', e.target.value)}
                value={this.state.city}
              />
            </div>
            <div style={styles.formItem}>
              State:
              <Input
                placeholder="State"
                onChange={e => this.onChange('state', e.target.value)}
                value={this.state.state}
              />
            </div>
            <div style={styles.formItem}>
              ZIP:
              <Input
                placeholder="ZIP"
                onChange={e => this.onChange('zip', e.target.value)}
                value={this.state.zip}
              />
            </div>
            <div style={styles.formItem}>
              Contact Phone:
              <Input
                placeholder="Contact Phone"
                onChange={e => this.onChange('phone', e.target.value)}
                value={this.state.phone}
              />
            </div>
            <div style={styles.formItem}>
              Contact Person:
              <Input
                placeholder="Contact Person"
                onChange={e => this.onChange('contact', e.target.value)}
                value={this.state.contact}
              />
            </div>
            <div style={styles.formItem}>
              Contact Email:
              <Input
                placeholder="Contact Email"
                onChange={e => this.onChange('email', e.target.value)}
                value={this.state.email}
              />
            </div>
          </div>
          <Divider />
          Status:
          <Select
            placeholder="Status"
            style={{ width: 120 }}
            onChange={this.onStatusChange}
            value={this.state.status}
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
          <div style={styles.bottomThird}>
            <div style={styles.formItem} />
          </div>
          <TextArea
            rows={4}
            placeholder="Notes"
            onChange={e => this.onChange('notes', e.target.value)}
            value={this.state.notes}
          />
        </div>
      </Modal>
    );
  }
}

export default CustomerForm;
