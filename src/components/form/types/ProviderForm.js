import React from 'react';
import {db} from '../../../firebase';
import {Input, Select, Divider, Modal} from 'antd';
import ProviderInfo from '../ProviderInfo';


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
        justifyContent: 'flex-start'
    }
};


//Provider Form Component
class ProviderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provider_id: null,
            address: null,
            city: null,
            state: null,
            zip: null,
            county: null,
            phone: null,
            contact: null,
            email: null
        }
    }

    // TODO: DRY using this
    //Functions to update state on change of each input field.
    onZipChange = (value) => {
        this.setState({zip: value})
    }
    onNameChange = (value) => {
        this.setState({provider_name: value})
    }
    onAddressChange = (value) => {
        this.setState({address: value})
    }
    onCityChange = (value) => {
        this.setState({city: value})
    }
    onStateChange = (value) => {
        this.setState({us_state: value})
    }
    onCountyChange = (value) => {
        this.setState({county: value})
    }
    onContactPhoneChange = (value) => {
        this.setState({contact_phone: value})
    }
    onContactNameChange = (value) => {
        this.setState({contact_name: value})
    }
    onContactEmailChange = (value) => {
        this.setState({contact_email: value})
    }
    onClickFundingSource = (value) => {
        this.setState({payment_source: value});
    }
    clearPaymentSource = () => {
        this.setState({payment_source: null});
    }
    onProviderNameChange = (value) => {
        this.setState({provider_name: value})
    }
    onNameChange = (value) => {
        this.setState({name: value})
    }
    onNotesChange = (value) => {
        this.setState({notes: value})
    }
    onStatusChange = (value) => {
        this.setState({status: value})
    }


    //Used to send the data to the databsae and reset the state.
    handleOk = () => {
        this
            .props
            .onCancel();
        console.log(this.state);
        db.pushProviderObj(this.state);

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this.props.refreshTable();

        this.setState({
            provider_name: null,
            address: null,
            city: null,
            us_state: null,
            zip: null,
            county: null,
            contact_phone: null,
            contact_name: null,
            contact_email: null
        }); 
    }

 

    render() {

        return (

            <Modal
                title="Add New Provider"
                style={{top: 20}}
                width={'50vw'}
                destroyOnClose={true}
                visible={this.props.formModalVisible}
                okText='Submit'
                onOk={this.handleOk}
                onCancel={this.props.onCancel}>

                <div style={styles.form}>
                    <div style={styles.topThird}>
                        <div style={styles.formItem}>
                            Provider Name:
                            <Input
                                placeholder="Provider Name"
                                onChange={(e) => this.onProviderNameChange(e.target.value)}/>
                        </div>
                    </div>

                    <Divider orientation="left">Contact Information</Divider>
                    <ProviderInfo
                        onZipChange={this.onZipChange}
                        onCityChange={this.onCityChange}
                        onCountyChange={this.onCountyChange}
                        onStateChange={this.onStateChange}
                        onAddressChange={this.onAddressChange}
                        onContactEmailChange={this.onContactEmailChange}
                        onContactNameChange={this.onContactNameChange}
                        onContactPhoneChange={this.onContactPhoneChange}/> 

                    <Divider/>
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

export default ProviderForm;
