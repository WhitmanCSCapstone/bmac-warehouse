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
    const productObj = props.products[props.value.product];
    this.state = {
      defaultValue: productObj ? productObj['product_id'] : undefined
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value.product !== prevProps.value.product) {
      const prodObj = this.props.products[this.props.value.product];
      const givenProdName = prodObj ? prodObj['product_id'] : undefined;
      this.setState({
        defaultValue: givenProdName ? givenProdName : this.props.value.product
      });
    }
  }

  onChange = val => {
    this.props.onChange(val);
  };

  render() {
    return (
      <AutoComplete
        dataSource={this.props.autocompleteOptionsList}
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
