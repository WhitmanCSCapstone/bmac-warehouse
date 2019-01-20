import React from 'react';
import { AutoComplete } from 'antd';
import { db } from '../../firebase';

const styles = {
  container: {
    width: '100%',
  },
}

class ProductAutoComplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount(){
    db.onceGetProducts().then(snapshot => {
      var data = this.getProductNames(Object.values(snapshot.val()));
      this.setState({ data: data });
    });
  }

  getProductNames = (data) => {
    var seen = {};
    for(var product of data){
      var name = product['product_id'];
      // if there's a dupe then skip it
      // TODO: make it so that it doesn't have to skip dupes
      if(!(name in seen) && name !== ''){
        seen[name] = true;
      }
    }
    return Object.keys(seen);
  }

  render() {
    return(
      <AutoComplete
        dataSource={this.state.data}
        style={styles.container}
        value={this.props.value}
        onChange={ value => this.props.onChange('product', this.props.index, value) }
        placeholder="Product"
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  }
}

export default ProductAutoComplete;
