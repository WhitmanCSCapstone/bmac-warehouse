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
      dataSourceTypeItemList: [],
      dictionary: {},
    }
  }

  componentDidMount(){
    db.onceGetCustomers().then(snapshot => {

      var data = snapshot.val();
      var dictionary = {}
      var dataSourceTypeItemList = [];

      for(let [key, value] of Object.entries(data)) {
        let name = value['customer_id'];
        dataSourceTypeItemList.push({value: key, text: name});
        dictionary[key] = name;
      }

      this.setState({
        dataSourceTypeItemList: dataSourceTypeItemList,
        dictionary: dictionary,
      });

    });
  }

  onChange = (val) => {
    this.props.onCustomerChange(val);
  }

  render() {
    return(
      <AutoComplete
        dataSource={this.state.dataSourceTypeItemList}
        key={this.state.defaultValue}
        style={styles.container}
        onChange={ this.onChange }
        placeholder="Customer"
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  }
}

export default CustomerAutoComplete;
