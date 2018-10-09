import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Form, Icon, Input, Button, DatePicker } from 'antd';

const FormItem = Form.Item;

const { MonthPicker, RangePicker, Weekpicker } = DatePicker;

const styles = {
  container: {
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
      {getFieldDecorator('shipDate', {
            rules: [{ required: true, message: 'Please input the Shipping Date!' }],
          })(
            <DatePicker onChange={this.onChange} placeholder="Enter Ship Date" />
        )}
      </FormItem>


      <FormItem> 
      {getFieldDecorator('unitWeight', {
            rules: [{ required: true, message: 'Please input the Unit Weight!' }],
          })(
            <DatePicker onChange={this.onChange} placeholder="Enter Unit Weight" />
        )}
      </FormItem>
      

      <FormItem> 
      {getFieldDecorator('shipVia', 
      )(
<<<<<<< HEAD
            <DatePicker onChange={this.onChange} placeholder="Enter Ship Date" />
        )}
      </FormItem>

      </Form>}
        
=======
import {Button} from 'antd';
=======
import { Form, Icon, Input, Button } from 'antd';
=======
import { Form, Icon, Input, Button, DatePicker } from 'antd';
>>>>>>> 9646359... Form page changes

const FormItem = Form.Item;
>>>>>>> 5f83b3f... Remade basic changes to the form and shipments pages

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        This is the home page!

        <Button onClick={console.log('OnClick')} type="primary" style={styles.button}> Forms</Button>
>>>>>>> 01a3fe2... Added a page for forms
=======
=======
      yo
=======
>>>>>>> d5a0fe8... made basic changes to the forms page and tacked it onto shipments
=======

      <Button style={styles.button} 
      onClick={this.onAddNewShipment}>
      Add New Shipment
      </Button>
      
      {!this.state.formDisplayToggle ? null : 
      <Form style={styles.form}>
>>>>>>> 9646359... Form page changes
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
=======
>>>>>>> 377bca0... commit
            <DatePicker onChange={this.onChange} placeholder="Enter Ship Date" />
        )}
      </FormItem>
<<<<<<< HEAD
>>>>>>> 5f83b3f... Remade basic changes to the form and shipments pages
        What is up?
        <Button onClick={console.log('OnClick')} type="primary" style={styles.button}> Form page</Button>
>>>>>>> 5bf22ff... Committing changes made to the form and home pages to help create a form.
=======

      </Form>}
        
>>>>>>> 9646359... Form page changes
      </div>
    );
  }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export default Form.create()(Forms);
=======
export default Home;
>>>>>>> 01a3fe2... Added a page for forms
=======
export default Form;
>>>>>>> 5bf22ff... Committing changes made to the form and home pages to help create a form.
=======
export default Forms;
>>>>>>> 5f83b3f... Remade basic changes to the form and shipments pages
=======
export default Form.create()(Forms);
>>>>>>> 9646359... Form page changes
