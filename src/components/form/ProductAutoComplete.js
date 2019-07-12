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
      defaultValue: null
    };
  }

  componentDidMount() {
    const prodObj = this.props.products[this.props.obj.product];
    const givenProdName = prodObj ? prodObj['product_id'] : undefined;
    this.setState({
      defaultValue: givenProdName ? givenProdName : this.props.obj.product
    });
  }

  onChange = val => {
    this.props.onProductChange(val);
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
