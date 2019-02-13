import React from 'react';
import {db} from '../../../firebase';
import {Input, Select, Divider, Modal, DatePicker} from 'antd';

//This is for the notes section.
const {TextArea} = Input;
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
    constructor(props) {
        super(props);
        this.state = {
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
            notes: null
        }
    }
    //Listeners
    onCustomerNameChange = (value) => {
        this.setState({customer_id: value})
    }
    onAddressChange = (value) => {
        this.setState({address: value})
    }
    onCityChange = (value) => {
        this.setState({city: value})
    }
    onStateChange = (value) => {
        this.setState({state: value})
    }
    onZipChange = (value) => {
        this.setState({zip: value})
    }
    onCountyChange = (value) => {
        this.setState({county: value})
    }
    onContactChange = (value) => {
        this.setState({contact: value})
    }
    onPhoneChange = (value) => {
        this.setState({phone: value})
    }
    onEmailChange = (value) => {
        this.setState({email: value})
    }
    onStatusChange = (value) => {
        this.setState({status: value})
    }
    onNotesChange = (value) => {
        this.setState({notes: value})
    }

    //Ok Click
    handleOk = () => {
        this
            .props
            .onCancel();

        db.pushCustomerObj(this.state);

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this
            .props
            .refreshTable();

        this.setState({
            customer_id: null,
            address: null,
            city: null,
            state: null,
            zip: null,
            county: null, //is an entry in database but not used in old or new forms, will leave here in case ever needs to be used.
            contact: null,
            phone: null,
            email: null,
            status: null,
            notes: null
        });
    }

    render() {
        return (
            <Modal
                title="Add New Customer"
                style={{
                top: 20
            }}
                width={'50vw'}
                destroyOnClose={true}
                visible={this.props.formModalVisible}
                okText='Submit'
                onOk={this.handleOk}
                onCancel={this.props.onCancel}>

                <div style={styles.form}>

                    <div style={styles.formItem}>
                        Customer Name:
                        <Input
                            placeholder="Customer Name"
                            onChange={(e) => this.onCustomerNameChange(e.target.value)}/>

                    </div>

                    <Divider orientation="left">Customer Information</Divider>
                    <div style={styles.topThird}>
                        <div style={styles.formItem}>
                            Address:
                            <Input
                                placeholder="Address"
                                onChange={(e) => this.onAddressChange(e.target.value)}/>

                        </div>

                        <div style={styles.formItem}>
                            City:
                            <Input placeholder="City" onChange={(e) => this.onCityChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            State:
                            <Input
                                placeholder="State"
                                onChange={(e) => this.onStateChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            ZIP:
                            <Input placeholder="ZIP" onChange={(e) => this.onZipChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Contact Phone:
                            <Input
                                placeholder="Contact Phone"
                                onChange={(e) => this.onPhoneChange(e.target.value)}/>

                        </div>
                        <div style={styles.formItem}>
                            Contact Person:
                            <Input
                                placeholder="Contact Person"
                                onChange={(e) => this.onContactChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Contact Email:
                            <Input
                                placeholder="Contact Email"
                                onChange={(e) => this.onEmailChange(e.target.value)}/>
                        </div>
                    </div>
                    <Divider orientation="left">Status</Divider>
                    Status:
                    <Select
                        placeholder="Status"
                        style={{
                        width: 120
                    }}
                        onChange={this.onStatusChange}>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>

                    </Select>
                    <div style={styles.bottomThird}>

                        <div style={styles.formItem}></div>

                    </div>

                    <TextArea
                        rows={4}
                        placeholder="Notes"
                        onChange={(e) => this.onNotesChange(e.target.value)}/>
                    
                </div>

            </Modal>
        );
    }
}

export default CustomerForm;