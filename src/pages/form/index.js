import React from 'react';
import { Form, Icon, Input, Button, DatePicker } from 'antd';

const FormItem = Form.Item;

const { MonthPicker, RangePicker, Weekpicker } = DatePicker;

const styles = {
  container: {
    backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

  },
  form:{

  },
  button: {
    display: 'flex',
    alignSelf: 'center'
  },
};

class Forms extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      formDisplayToggle: false,
    }
  }

  onAddNewShipment = () => {
    this.setState({
      formDisplayToggle: !this.state.formDisplayToggle,
    })
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div style={styles.container}>

      <Button style={styles.button} 
      onClick={this.onAddNewShipment}>
      Add New Shipment
      </Button>
      
      {!this.state.formDisplayToggle ? null : 
      <Form style={styles.form}>
      <FormItem> 
      {getFieldDecorator('products', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="products" />
          )}
      </FormItem>

      <FormItem> 
      {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <DatePicker onChange={this.onChange} placeholder="Enter Ship Date" />
        )}
      </FormItem>

      </Form>}
        
      </div>
    );
  }
}

export default Form.create()(Forms);
