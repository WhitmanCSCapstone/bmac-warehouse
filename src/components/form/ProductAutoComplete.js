import React from 'react';
import { AutoComplete } from 'antd';

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
      defaultValue: null
    };
  }

  componentDidMount() {
    const dataSourceTypeItemList = [];
    const productObjs = Object.values(this.props.products);

    for (let i = 0; i < productObjs.length; i++) {
      dataSourceTypeItemList.push({
        value: productObjs[i].uniq_id,
        text: productObjs[i].product_id
      });
    }

    const prodObj = this.props.products[this.props.obj.product];
    const givenProdName = prodObj ? prodObj['product_id'] : undefined;

    this.setState({
      dataSourceTypeItemList: dataSourceTypeItemList,
      defaultValue: givenProdName ? givenProdName : this.props.obj.product
    });
  }

  isRelevant(product) {
    if (!product) {
      return false;
    }
    const fsHash = product.funding_source;
    const fundsSource = this.props.fundingSources[fsHash];
    return (
      product.status !== 'discontinued' &&
      (fsHash === this.props.fundsSource || !fundsSource || !this.props.fundsSource)
    );
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
            const pHash = option.key;
            const product = this.props.products[pHash];
            if (this.isRelevant(product)) {
              return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
            }
          }
        }}
      />
    );
  }
}

export default ProductAutoComplete;
