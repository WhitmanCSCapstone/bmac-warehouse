import React from 'react';
import {Icon, Input, Button} from 'antd';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignContent: 'center'
    },

    formItem: {
        margin: '0em 0.5em 0.5em 0em',
        overflow: 'hidden'
    },

    sameLine: {}
};

class ProviderInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

  

    render() {
        return (
            <div style={styles.container}>

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