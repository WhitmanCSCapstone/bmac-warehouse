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
    justifyContent: 'flex-start'
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
    justifyContent: 'flex-start'
  }
};

//Provider Form Component
class ProviderForm extends React.Component {
  defaultState = {
    provider_id: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    county: null,
    phone: null,
    contact: null,
    email: null
  };
  constructor(props) {
    super(props);
    this.state = {
      ...this.defaultState,
      ...props.rowData
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.rowData !== prevProps.rowData) {
      this.setState({
        ...this.defaultState,
        ...this.props.rowData
      });
    }
  }

  onChange = (prop, val) => {
    this.setState({
      [prop]: val
    });
  };

  //Used to send the data to the databsae and reset the state.
  handleOk = () => {
    var newData = JSON.parse(JSON.stringify(this.state));
    var row = this.props.rowData;
    if (row && row.uniq_id) {
      db.setProviderObj(row.uniq_id, newData);
    } else {
      db.pushProviderObj(this.state);
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
        title="Provider Form"
        style={{
          top: 20
        }}
        width={'50vw'}
        destroyOnClose={true}
        visible={this.props.modalVisible}
        okText="Submit"
        onCancel={this.props.closeModal}
        afterClose={this.props.closeForm}
        footer={[
          <Footer
            key="footer"
            rowData={this.props.rowData}
            closeModal={this.props.closeModal}
            handleOk={this.handleOk}
          />
        ]}
      >
        <div style={styles.form}>
          <div style={styles.formItem}>
            Provider Name:
            <Input
              value={this.state.provider_id}
              placeholder="Provider Name"
              onChange={e => this.onChange('provider_id', e.target.value)}
            />
          </div>

          <Divider orientation="left">Contact Information</Divider>
          <div style={styles.topThird}>
            <div style={styles.formItem}>
              Address:
              <Input
                value={this.state.address}
                placeholder="Address"
                onChange={e => this.onChange('address', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              City:
              <Input
                value={this.state.city}
                placeholder="City"
                onChange={e => this.onChange('city', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              State:
              <Input
                value={this.state.state}
                placeholder="State"
                onChange={e => this.onChange('state', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              ZIP:
              <Input
                value={this.state.zip}
                placeholder="ZIP"
                onChange={e => this.onChange('zip', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              County:
              <Input
                value={this.state.county}
                placeholder="County"
                onChange={e => this.onChange('county', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Contact Name:
              <Input
                value={this.state.contact}
                placeholder="Contact Name"
                onChange={e => this.onChange('contact', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Contact Phone:
              <Input
                value={this.state.phone}
                placeholder="Contact Phone"
                onChange={e => this.onChange('phone', e.target.value)}
              />
            </div>
            <div style={styles.formItem}>
              Contact Email:
              <Input
                value={this.state.email}
                placeholder="Contact Email"
                onChange={e => this.onChange('email', e.target.value)}
              />
            </div>
          </div>
          <Divider />
          <div style={styles.formItem}>
            Status:
            <br />
            <Select
              placeholder="Status"
              style={{
                width: 120
              }}
              onChange={value => this.onChange('status', value)}
              value={this.state.status}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>
          <div style={styles.formItem}>
            <TextArea
              value={this.state.notes}
              rows={4}
              placeholder="Notes"
              onChange={e => this.onChange('notes', e.target.value)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default ProviderForm;
