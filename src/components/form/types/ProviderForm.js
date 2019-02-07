import React from 'react';
import {db} from '../../../firebase';
import {Input, Select, Divider, Modal} from 'antd';
import ProviderInfo from '../ProviderInfo';

const {TextArea} = Input;

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
    },

    shipViaContainer: {
        width: '45%',
        margin: '0px 1em 1em 1em',
        display: 'flex',
        flexDirection: 'column'
    }
};

var ref = null;
const Option = Select.Option;

class ProviderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provider_name: null,
            address: null,
            city: null,
            us_state: null,
            zip: null,
            county: null,
            contact_phone: null,
            contact_name: null,
            contact_email: null
        }
    }

    // TODO: DRY using this

    onZipChange = (value) => {
        this.setState({zip: value})
    }

    onNameChange = (value) => {
        this.setState({provider_name: value})
    }

    onAddressChange = (value) => this.setState({address: value})

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

    onItemsChange = (prop, index, val) => {
        var itemsCopy = this
            .state
            .receive_items
            .slice(0); // shallow clone
        if (itemsCopy[index] === undefined) {
            itemsCopy[index] = {
                [prop]: val
            };
        } else {
            itemsCopy[index][prop] = val;
        }
        this.setState({receive_items: itemsCopy});

        var total_weight = 0;
        for (var item of this.state.receive_items) {
            var weight = parseInt(item['total_weight'])
            total_weight += isNaN(weight)
                ? 0
                : weight;
        }
        this.setState({
            total_weight: total_weight.toString()
        });
    }

    deleteEmptyReceiveItems = () => {
        var newItems = [];
        for (let obj of this.state.receive_items) {
            if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
                newItems.push(obj);
            }
        }
        this.setState({receive_items: newItems});
    }

    handleOk = () => {
        this
            .props
            .onCancel();

        this.deleteEmptyReceiveItems();

        db.pushReceiptObj(this.state);

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this
            .props
            .refreshTable();

        this.setState({
            provider_id: null,
            recieve_date: null,
            payment_source: null,
            receive_items: [
                {}, {}, {}, {}, {}
            ],
            billed_amt: null,
            notes: null,
            total_weight: null
        });
    }

    addReceiveItem = () => {
        this.setState({
            receive_items: [
                ...this.state.receive_items, {}
            ]
        });
    }

    removeReceiveItem = (removeIndex) => {
        var itemsCopy = this
            .state
            .receive_items
            .filter((obj, objIndex) => objIndex !== removeIndex)
        this.setState({receive_items: itemsCopy});
    }

    onStatusChange = (value) => {
        this.setState({status: value})
    }

    render() {

        return (

            <Modal
                title="Add New Provider"
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
                        {/* TODO make sure to change the props names that get passed down if you abstract it */}

                    <Divider/>
                    Status:
                    <Select
                        placeholder="Status"
                        style={{
                        width: 120
                    }}
                        onChange={this.onStatusChange}>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
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
