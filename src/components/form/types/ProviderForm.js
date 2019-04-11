import React from 'react';
import {db} from '../../../firebase';
import {Input, Select, Divider, Modal, Button} from 'antd';


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
    }
    constructor(props) {
        super(props);
        this.state = {
            ...this.defaultState,
            ...props.rowData
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.rowData !== prevProps.rowData) {
            this.setState({
                ...this.defaultState,
                ...this.props.rowData
            });
        }
    }

    // TODO: DRY using this
    //onChange = (prop, val) => {
      //  this.setState({
        //  prop: val,
       // })
      //}
    
    //Functions to update state on change of each input field.
    // TODO: Remove if onChange works.
    onZipChange = (value) => {
        this.setState({zip: value})
    }
    onNameChange = (value) => {
        this.setState({provider_id: value})
    }
    onAddressChange = (value) => {
        this.setState({address: value})
    }
    onCityChange = (value) => {
        this.setState({city: value})
    }
    onCountyChange = (value) => {
        this.setState({county: value})
    }
    onStateChange = (value) => {
        this.setState({state: value})
    }
    onContactPhoneChange = (value) => {
        this.setState({phone: value})
    }
    onContactNameChange = (value) => {
        this.setState({contact: value})
    }
    onContactEmailChange = (value) => {
        this.setState({email: value})
    }
    onClickFundingSource = (value) => {
        this.setState({payment_source: value});
    }
    clearPaymentSource = () => {
        this.setState({payment_source: null});
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
            .closeForm();

        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData
        if (row && row.uniq_id) {
            db.setProviderObj(row.uniq_id, newData)
        } else {
            db.pushProviderObj(this.state);
        }
        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this
            .props
            .refreshTable();

        this.setState({
            ...this.defaultState
        });
    }
    
    //Used to handle deleting the object being observed in the Modal.
    handleDelete = () => {
        db.deleteProviderObj(this.props.rowData.uniq_id);
        this
            .props
            .closeForm()
        this
            .props
            .refreshTable();
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
                onCancel={this.props.closeForm}
                footer={[
                <Button key = "delete" disabled = {this.props.rowData? false: true}type = "danger" onClick = {this.handleDelete}> Delete</Button>,
                <Button key = "Cancel" onClick={this.props.closeForm}>Cancel</Button >,
                < Button key = "submit" type = "primary" onClick = {this.handleOk} >Submit</Button>
                ]}>

                <div style={styles.form}>
                    <div style={styles.formItem}>
                        Provider Name:
                        <Input
                            rowData={this.props.rowData}
                            value={this.state.provider_id}
                            placeholder="Provider Name"
                            onChange={(e) => this.onNameChange(e.target.value)}/>
                    </div>

                    <Divider orientation="left">Contact Information</Divider>
                    <div style={styles.topThird}>
                        <div style={styles.formItem}>
                            Address:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.address}
                                placeholder="Address"
                                onChange={(e) => this.onAddressChange(e.target.value)}/>
                                
                        </div>
                        <div style={styles.formItem}>
                            City:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.city}
                                placeholder="City"
                                onChange={(e) => this.onCityChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            State:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.state}
                                placeholder="State"
                                onChange={(e) => this.onStateChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            ZIP:
                            <Input 
                                rowData={this.props.rowData}
                                value={this.state.zip}
                                placeholder="ZIP" 
                                onChange={(e) => this.onZipChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            County:
                            <Input 
                                rowData={this.props.rowData} 
                                value={this.state.county}
                                placeholder="County"
                                onChange={(e) => this.onCountyChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Contact Name:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.contact}
                                placeholder="Contact Name"
                                onChange={(e) => this.onContactNameChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Contact Phone:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.phone}
                                placeholder="Contact Phone"
                                onChange={(e) => this.onContactPhoneChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Contact Email:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.email}
                                placeholder="Contact Email"
                                onChange={(e) => this.onContactEmailChange(e.target.value)}/>
                        </div>
                    </div>
                    <Divider/>
                    <div style={styles.formItem}>
                        Status:<br/>
                        <Select
                            placeholder="Status"
                            style={{
                            width: 120
                        }}
                            onChange={this.onStatusChange}
                            rowData={this.props.rowData}
                            value={this.state.status}>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </div>
                    <div style={styles.formItem}>
                        <TextArea
                            rowData={this.props.rowData}
                            value={this.state.notes}
                            rows={4}
                            placeholder="Notes"
                            onChange={(e) => this.onNotesChange(e.target.value)}/>
                    </div>

                </div>

            </Modal>
        );
    }
}

export default ProviderForm;
