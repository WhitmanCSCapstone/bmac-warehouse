import React from 'react';
import {db} from '../../../firebase';
import {Input, Select, Divider, Modal, DatePicker} from 'antd';
import FundsSourceDropdownMenu from '../../FundsSourceDropdownMenu';
import Moment from 'moment';


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

    datePicker: {
        width: '100%'
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
class ProductForm extends React.Component {

    defaultState = {
        product_id: null,
        funding_source: null,
        unit_weight: null,
        unit_price: null,
        initial_date: null,
        initial_stock: null,
        minimum_stock: null,
        history: null,
        current_stock: null,
        inventory_date: null,
        status: null,
        uniq_id: null,
        notes: null,
      };

      constructor(props) {
        super(props);
        this.state = { ...this.defaultState, ...props.rowData }
      }

      componentDidUpdate(prevProps, prevState) {
        if (this.props.rowData !== prevProps.rowData) {
          this.setState({ ...this.defaultState, ...this.props.rowData });
        }
      }

    // TODO: DRY using this Functions to update state on change of each input field.
    onProductNameChange = (value) => {
        this.setState({product_id: value})
    }
    onFundingSourceChange = (value) => {
        this.setState({funding_source: value})
    }
    onWeightChange = (value) => {
        this.setState({unit_weight: value})
    }
    onPriceChange = (value) => {
        this.setState({unit_price: value})
    }
    onInitialStockChange = (value) => {
        this.setState({initial_stock: value})
    }
    onMinimumStockChange = (value) => {
        this.setState({minimum_stock: value})
    }
    onDateChange = (value) => {
        if (value!=null){
            this.setState({initial_date: value.format('MM/DD/YYYY')})
        } 
    }
    onStatusChange = (value) => {
        this.setState({status: value})
    }
    onClickFundingSource = (value) =>{
        this.setState({funding_source: value})
    }

      clearFundingSource = () => {
        this.setState({ funding_source: null });
      }
    onNotesChange = (value) =>{
        this.setState({notes: value})
    }
    //Used to send the data to the databsae and reset the state.
    handleOk = () => {

        this.props.onCancel();

        var newData = JSON.parse(JSON.stringify(this.state));
        var row = this.props.rowData

        if (row) {
            // if we are editing a shipment, set in place
            console.log('editing')
            db.setProductObj(row.uniq_id, newData);
          } else {
              console.log('new entry')
            // else we are creating a new entry
            db.pushProductObj(newData);
          }

        // this only works if the push doesn't take too long, kinda sketch, should be
        // made asynchronous
        this.props.refreshTable();

        this.setState({ ...this.defaultState });
    }

    render() {

        return (

            <Modal
                title="Add New Product"
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

                    <div style={styles.formItem}>
                        Product Name:
                        <Input
                            rowData={this.props.rowData}
                            value={this.state.product_id}
                            placeholder="Product Name"
                            onChange={(e) => this.onProductNameChange(e.target.value)}/>
                            

                    </div>

                    <Divider orientation="left">Product Information</Divider>
                    <div style={styles.topThird}>
                        <div style={styles.formItem}>
                            Funding Source:
                            <FundsSourceDropdownMenu
                                rowData={this.props.rowData}
                                disabled={false}
                                fundingSource={this.state.funding_source}
                                style={styles.fundsSourceDropdown}
                                onClick={this.onClickFundingSource}
                                clearFundingSource={this.clearFundingSource}
                                required={true}
                            />
                                
                        </div>
                        
                        <div style={styles.formItem}>
                            Unit Weight:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.unit_weight}
                                placeholder="Unit Weight"
                                onChange={(e) => this.onWeightChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Unit Price:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.unit_price}
                                placeholder="Unit Price"
                                onChange={(e) => this.onPriceChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Initial Stock:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.initial_stock}
                                placeholder="Initial Stock"
                                onChange={(e) => this.onInitialStockChange(e.target.value)}/>
                        </div>
                        <div style={styles.formItem}>
                            Initial Date:
                            <DatePicker
                                rowData={this.props.rowData}
                                style={styles.datePicker}
                                onChange={(date) => this.onDateChange(date)}
                                placeholder="Initial Date"
                                allowClear={false}
                                key={`initialdate:${this.state.initial_date}`}
                                defaultValue={
                                    this.state.initial_date
                                              ? Moment(this.state.initial_date, 'MM/DD/YYYY')
                                              : this.state.initial_date
                                  }/>
                                
                                
                        </div>
                        <div style={styles.formItem}>
                            Minimum Stock:
                            <Input
                                rowData={this.props.rowData}
                                value={this.state.minimum_stock}
                                placeholder="Initial Stock"
                                onChange={(e) => this.onMinimumStockChange(e.target.value)}/>
                        </div>
                    </div>
                    <Divider/>
                    Status:
                    <Select
                        placeholder="Status"
                        style={{
                        width: 120
                    }}
                        onChange={this.onStatusChange}
                        rowData={this.props.rowData}
                        value={this.state.status}
                        >
                        
                        <Option value="Active">Active</Option>
                        <Option value="Discontinued">Discontinued</Option>

                    </Select>

                    <div style={styles.bottomThird}>

                        <div style={styles.formItem}></div>

                    </div>

                    <TextArea
                        value={this.state.notes}
                        rowData={this.props.rowData}
                        rows={4}
                        placeholder="Notes"
                        onChange={(e) => this.onNotesChange(e.target.value)}/>

                </div>

            </Modal>
        );
    }
}

export default ProductForm;
