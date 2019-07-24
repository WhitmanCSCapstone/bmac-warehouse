import React from 'react';
import { Icon, InputNumber, Button, Form } from 'antd';
import { getAutocompleteOptionsList } from '../../utils/misc.js';
import ProductAutoComplete from './ProductAutoComplete';

function isDataInRow(rowObj) {
  let entries = Object.entries(rowObj);
  for (let entry of entries) {
    let key = entry[0];
    let val = entry[1];
    if (val !== undefined) {
      return true;
    }
  }
  return false;
}

const styles = {
  container: {
    width: '100%'
  },

  firstIcon: {
    marginTop: '29px',
    alignSelf: 'center'
  },

  iconDisabled: {
    alignSelf: 'center',
    opacity: 0
  },

  row: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: '0.5em'
  },

  productItem: {
    width: '50%',
    margin: '0em 0.5em 0em 0em',
    padding: 0
  },

  formItem: {
    margin: '0em 0.5em 0em 0.5em',
    padding: 0,
    flexGrow: 1
  },

  input: {
    margin: 0,
    padding: 0,
    width: '100%'
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

  shouldComponentUpdate(nextProps) {
    if (
      this.props.fundsSource !== nextProps.fundsSource ||
      this.props.items !== nextProps.items ||
      this.props.products !== nextProps.products ||
      this.props.fundingSources !== this.props.fundingSources
    ) {
      return true;
    }
    return false;
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
      this.props.onChange('total_weight', index, calculatedTotalWeight);
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
      let material_number = product.material_number ? product.material_number : null;
      this.props.onChange('material_number', index, material_number);
      this.changeUnitWeight(unitWeight, obj, index);
    }
  };

  onProductChange = (index, val) => {
    this.props.onChange('product', index, val);
  };

  render() {
    function invisibleBtn() {
      return (
        <Icon
          className={'dynamic-delete-button'}
          style={styles.iconDisabled}
          type={'minus-circle-o'}
        />
      );
    }

    const accessorAndOnChangeList = [
      {
        accessor: 'material_number',
        onChange: (val, obj, index) => this.props.onChange('material_number', index, val)
      },
      {
        accessor: 'unit_weight',
        onChange: (val, obj, index) => this.changeUnitWeight(val, obj, index)
      },
      {
        accessor: 'case_lots',
        onChange: (val, obj, index) => {
          this.props.onChange('case_lots', index, val);
          this.updateTotalWeight(obj, index);
        }
      },
      {
        accessor: 'total_weight',
        onChange: (val, obj, index) => this.props.onChange('total_weight', index, val)
      }
    ];

    return (
      <div style={styles.container}>
        {!this.props.items
          ? null
          : this.props.items.map((obj, index) => {
              return (
                <div key={index} style={styles.row}>
                  <Form.Item
                    style={styles.productItem}
                    key={`product_id${index}`}
                    label={index === 0 ? 'Product:' : ''}
                  >
                    {this.props.getFieldDecorator(`product_id${index}`, {
                      initialValue: obj ? obj.product : undefined,
                      rules: [
                        {
                          type: 'enum',
                          enum: Object.keys(this.props.products),
                          required: index === 0 || isDataInRow(obj),
                          message: 'Please Enter A Valid Product'
                        }
                      ]
                    })(
                      <ProductAutoComplete
                        onChange={val => this.onProductChange(index, val)}
                        autocompleteOptionsList={this.state.autocompleteOptionsList}
                        onProductSelect={val => this.onProductSelect(index, obj, val)}
                        products={this.props.products}
                        index={index}
                      />
                    )}
                  </Form.Item>

                  {accessorAndOnChangeList.map(pair => {
                    const niceLabel = pair.accessor
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    return (
                      <Form.Item
                        style={styles.formItem}
                        key={`${pair.accessor}${index}`}
                        label={index === 0 ? niceLabel : ''}
                      >
                        {this.props.getFieldDecorator(`${pair.accessor}${index}`, {
                          initialValue: obj ? obj[pair.accessor] : undefined,
                          rules: [
                            {
                              transform: val => (val === undefined ? undefined : Number(val)),
                              type: 'number',
                              message: 'Not A Number'
                            }
                          ]
                        })(
                          <InputNumber
                            style={styles.input}
                            placeholder={niceLabel}
                            onChange={val => pair.onChange(val, obj, index)}
                          />
                        )}
                      </Form.Item>
                    );
                  })}

                  {this.props.items.length === 1 ? (
                    invisibleBtn()
                  ) : (
                    <Icon
                      className={'dynamic-delete-button'}
                      style={index === 0 ? styles.firstIcon : {}}
                      type={'minus-circle-o'}
                      onClick={() => this.props.removeProductItem(index)}
                    />
                  )}
                </div>
              );
            })}

        <div style={styles.formItem}>
          <Button type={'dashed'} onClick={this.props.addProductItem}>
            <Icon type={'plus'} /> Add fields
          </Button>
        </div>
      </div>
    );
  }
}

export default ProductItems;
