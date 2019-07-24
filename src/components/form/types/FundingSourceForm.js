import React from 'react';
import { db } from '../../../firebase';
import { hasErrors } from '../../../utils/misc.js';
import { Input, Form, Modal } from 'antd';
import Footer from '../Footer';

class FundingSourceForm extends React.Component {
  defaultState = {
    code: null,
    id: null,
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

  //Used to send the data to the databsae and reset the state.
  handleOk = showLoadingAnimation => {
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        showLoadingAnimation();
        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData;

        if (row && row.uniq_id) {
          // if we are editing a fundingSource, set in place
          db.setFundingSourceObj(row.uniq_id, newData);
        } else {
          // else we are creating a new entry
          db.pushFundingSourceObj(newData);
        }

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this.props.refreshTable(() => {
          this.props.closeModal();
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form;

    return (
      <div>
        <Modal
          title={'Funding Source'}
          style={{
            top: 20
          }}
          width={'25vw'}
          destroyOnClose={true}
          visible={this.props.modalVisible}
          onCancel={this.props.closeModal}
          afterClose={this.props.closeForm}
          footer={[
            <Footer
              key={'footer'}
              rowData={this.props.rowData}
              closeModal={this.props.closeModal}
              handleOk={this.handleOk}
              saveDisabled={!isFieldsTouched() || hasErrors(getFieldsError())}
            />
          ]}
        >
          <Form layout={'vertical'} onSubmit={this.handleSubmit}>
            <Form.Item label={'Funding Source'}>
              {getFieldDecorator('id', {
                initialValue: this.state.id,
                rules: [
                  {
                    whitespace: true,
                    required: true,
                    message: 'Please Enter A Valid Funding Source'
                  }
                ]
              })(
                <Input
                  placeholder={`Funding Source`}
                  onChange={e => this.onChange('id', e.target.value)}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedFundingSourceForm = Form.create({ name: 'FundingSourceForm' })(FundingSourceForm);

export default WrappedFundingSourceForm;
