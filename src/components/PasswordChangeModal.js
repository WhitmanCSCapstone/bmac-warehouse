import React, {Component} from 'react';
import {Modal} from 'antd';
import PasswordChangeForm from './../components/PasswordChange';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null
};

class PasswordChangeModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            visible: this.props.visiblePasswordChange
        };
    }

    showModal = () => {
        this
            .props
            .visible()
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({visible: false});
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({visible: false});
    }

    render() {
        return (
            <Modal
                title="Change Password"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                mask={false}>
                <PasswordChangeForm/>
            </Modal>
        );
    }
}

export default PasswordChangeModal;