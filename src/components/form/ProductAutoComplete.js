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

      let products = Object.entries(data);

      products = products.filter(obj => {
        const funds_source = obj[1].funding_source;
        return (
          // filter out prouduct with conflicting funding src
          ((funds_source === this.props.fundsSource ||
            // if there is no form funds source, list all products
            !this.props.fundsSource ||
            // if theres no product funds source, list the product anyway
            !funds_source) &&
            // filter out if the product is marked as discontinued
            obj[1].status !== 'discontinued') ||
          // make an exception to the above rules if the product is hardcoded in already
          obj[0] === this.props.obj.product
        );
      });

      for (let [key, value] of products) {
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
        onSelect={val => this.props.onProductSelect(val)}
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
