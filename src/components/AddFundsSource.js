import React from 'react';
import { db } from '../firebase';
import { Input, Button, Modal } from 'antd';

class AddFundsSource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            formModalVisible: false
        }
    }

    onChange = (value) => {
        this.setState({ id: value });
    }
    //Clean data for table refresh.
    cleanFundingSourcesData = (data) => {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            newData.push(data[i]['id']);
        }
        return newData;
    }

    onOk = () => {
        //Push the new funding source to the db.
        var id = JSON.parse(JSON.stringify(this.state.id));
        db.pushFundingSource({ id })
        this.setState({ formModalVisible: false })
        //Refresh the table
        db
            .onceGetFundingSources()
            .then(snapshot => {
                var data = this.cleanFundingSourcesData(Object.values(snapshot.val()));
                this.setState({ fundingSources: data })
            });

    }
    render() {
        return (
            <div>
                <Button type="primary" onClick={() => this.setState({ formModalVisible: true })}>
                    Add Funding Source
                </Button>
                <Modal
                    title="Add New Funding Source"
                    style={{
                        top: 20
                    }}
                    width={'50vw'}
                    destroyOnClose={true}
                    visible={this.state.formModalVisible}
                    okText='Submit'
                    onCancel={() => this.setState({ formModalVisible: false })}
                    onOk={this.onOk}>

                    New Funding Source:
                    <Input
                        placeholder={'New Funding Source'}
                        onChange={(e) => this.onChange(e.target.value)}></Input>
                </Modal>
            </div>
        );

    }
}

export default AddFundsSource;
