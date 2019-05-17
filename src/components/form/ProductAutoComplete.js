import React from 'react';
import { AutoComplete } from 'antd';
import { db } from '../../firebase';

const styles = {
  container: {
    width: '100%'
  }
};

class ProductAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceTypeItemList: [],
      dictionary: {},
      defaultValue: null
    };
  }

  componentDidMount() {
    db.onceGetProducts().then(snapshot => {
      const data = snapshot.val();
      const dictionary = {};
      const dataSourceTypeItemList = [];

      for (let [key, value] of Object.entries(data)) {
        let name = value['product_id'];
        dataSourceTypeItemList.push({ value: key, text: name });
        dictionary[key] = name;
      }

      const givenProdName = dictionary[this.props.obj.product];

      this.setState({
        dataSourceTypeItemList: dataSourceTypeItemList,
        dictionary: dictionary,
        defaultValue: givenProdName ? givenProdName : this.props.obj.product
      });
    });
  }

  onChange = val => {
    this.props.onProductChange(val);
  };

  render() {
    return (
      <AutoComplete
        dataSource={this.state.dataSourceTypeItemList}
        defaultValue={this.state.defaultValue}
        key={this.state.defaultValue}
        style={styles.container}
        onChange={this.onChange}
        placeholder="Product"
        filterOption={(inputValue, option) => {
          if (option.props.children) {
            return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
          }
        }}
      />
    );
  }
}

export default ProductAutoComplete;
