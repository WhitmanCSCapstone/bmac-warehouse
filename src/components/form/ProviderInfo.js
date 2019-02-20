import React from 'react';
import {Icon, Input, Button} from 'antd';


//Styles
const styles = {


    form: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },

    formItem: {
        width: '45%',
        margin: '0px 1em 1em 1em'
    },
};


class ProviderInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

  

    render() {
        return (
            <div style={styles.form}>

                <div style={styles.formItem}>
                    Address:
                    <Input
                        placeholder="Address"
                        onChange={(e) => this.props.onAddressChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    City:
                    <Input placeholder="City" onChange={(e) => this.props.onCityChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    State:
                    <Input
                        placeholder="State"
                        onChange={(e) => this.props.onStateChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    ZIP:
                    <Input placeholder="ZIP" onChange={(e) => this.props.onZipChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    County:
                    <Input
                        placeholder="County"
                        onChange={(e) => this.props.onCountyChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    Contact Name:
                    <Input
                        placeholder="Contact Name"
                        onChange={(e) => this.props.onContactNameChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    Contact Phone:
                    <Input
                        placeholder="Contact Phone"
                        onChange={(e) => this.props.onContactPhoneChange(e.target.value)}/>
                </div>
                <div style={styles.formItem}>
                    Contact Email:
                    <Input
                        placeholder="Contact Email"
                        onChange={(e) => this.props.onContactEmailChange(e.target.value)}/>
                </div>

            </div>
        );
    }
}

export default ProviderInfo;