import React from 'react';
import { AutoComplete } from 'antd';
import { db } from '../../firebase';

const styles = {
  container: {
    width: '100%',
  },
}

class CustomerAutoComplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      selectedHash: null,
    }
  }

  componentDidMount(){
    db.onceGetCustomers().then(snapshot => {

      var data = snapshot.val();
      var names = [];
      var dictionary = {};
      for(let [key, value] of Object.entries(data)){

        let name = value['customer_id'];

        if(name in dictionary || name === ""){
          console.log(`theres a dupe or an empty string in the customers table that should be deleted, here's its customer_id value: ${name}`);
        } else {
          dictionary[name] = key;
          names.push(name);
        }
      }

      this.setState({
        dictionary: dictionary,
        names: names,
      });

    });
  }

  onChange = (val) => {
    var hash = this.state.dictionary[val];
    this.props.onCustomerChange(hash);
  }

  render() {
    return(
      <AutoComplete
        dataSource={this.state.names}
        defaultValue={this.props.rowData ? this.props.rowData.customer_id : undefined }
        style={styles.container}
        onChange={ this.onChange }
        placeholder="Customer"
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  }
}

export default CustomerAutoComplete;
