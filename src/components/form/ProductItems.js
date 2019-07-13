import React from 'react';
import { Icon, Input, Button } from 'antd';
import { getAutocompleteOptionsList } from '../../utils/misc.js';
import ProductAutoComplete from './ProductAutoComplete';

const styles = {
  container: {},

  icon: {
    alignSelf: 'center',
    marginBottom: '0.20em'
  },

  iconDisabled: {
    alignSelf: 'center',
    marginBottom: '0.5em',
    opacity: 0
  },

  row: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  productItem: {
    width: '40%',
    margin: '0em 0.5em 0.5em 0em'
  },

  formItem: {
    margin: '0em 0.5em 0.5em 0em',
    width: '20%',
    overflow: 'hidden'
  }
};

class ProductItems extends React.Component {
  constructor(props) {
    super(props);
    const productObjs = Object.values(this.props.products);
    const autocompleteOptionsList = getAutocompleteOptionsList(
      productObjs,
      this.props.fundsSource,
      props.fundingSources
    );
    this.state = {
      autocompleteOptionsList: autocompleteOptionsList
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.fundsSource !== prevProps.fundsSource) {
      const productObjs = Object.values(this.props.products);
      this.setState({
        autocompleteOptionsList: getAutocompleteOptionsList(
          productObjs,
          this.props.fundsSource,
          this.props.fundingSources
        )
      });
    }
  }

  updateTotalWeight = (obj, index) => {
    const calculatedTotalWeight = obj['case_lots'] * obj['unit_weight'];
    if (calculatedTotalWeight) {
      this.props.onChange('total_weight', index, calculatedTotalWeight.toString());
    }
  };

  changeUnitWeight = (weight, obj, index) => {
    this.props.onChange('unit_weight', index, weight);
    this.updateTotalWeight(obj, index);
  };

  onProductSelect = (index, obj, val) => {
    const product = this.props.products[val];
    if (product) {
      const unitWeight = product.unit_weight;
      this.changeUnitWeight(unitWeight, obj, index);
    }
  };

  onProductChange = (index, val) => {
    this.props.onChange('product', index, val);
  };

  render() {
    function invisibleBtn() {
      return (
        <Icon className="dynamic-delete-button" style={styles.iconDisabled} type="minus-circle-o" />
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.row}>
          <span style={styles.productItem}>Product</span>
          <span style={styles.formItem}>Unit Weight</span>
          <span style={styles.formItem}>Case Lots</span>
          <span style={styles.formItem}>Total Weight</span>
          {invisibleBtn()}
        </div>
        {!this.props.items
          ? null
          : this.props.items.map((obj, index) => {
              return (
                <div key={index} style={styles.row}>
                  <div style={styles.productItem}>
                    <ProductAutoComplete
                      onProductChange={val => this.onProductChange(index, val)}
                      obj={obj ? obj : undefined}
                      index={index}
                      autocompleteOptionsList={this.state.autocompleteOptionsList}
                      onProductSelect={val => this.onProductSelect(index, obj, val)}
                      products={this.props.products}
                      fundingSources={this.props.fundingSources}
                    />
                  </div>

                  <div style={styles.formItem}>
                    <Input
                      placeholder="Unit Weight"
                      value={obj ? obj['unit_weight'] : undefined}
                      onChange={e => this.changeUnitWeight(e.target.value, obj, index)}
                    />
                  </div>

                  <div style={styles.formItem}>
                    <Input
                      placeholder="Case Lots"
                      value={obj ? obj['case_lots'] : undefined}
                      onChange={e => {
                        this.props.onChange('case_lots', index, e.target.value);
                        this.updateTotalWeight(obj, index);
                      }}
                    />
                  </div>

                  <div style={styles.formItem}>
                    <Input
                      placeholder="Total Weight"
                      value={obj ? obj['total_weight'] : undefined}
                      onChange={e => this.props.onChange('total_weight', index, e.target.value)}
                    />
                  </div>

                  {this.props.items.length === 1 ? (
                    invisibleBtn()
                  ) : (
                    <Icon
                      className="dynamic-delete-button"
                      style={styles.icon}
                      type="minus-circle-o"
                      onClick={() => this.props.removeProductItem(index)}
                    />
                  )}
                </div>
              );
            })}

        <div style={styles.formItem}>
          <Button type="dashed" onClick={this.props.addProductItem}>
            <Icon type="plus" /> Add fields
          </Button>
        </div>
      </div>
    );
  }
}

export default ProductItems;
