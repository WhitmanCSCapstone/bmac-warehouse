import React from 'react';
import { Icon, Input, Button } from 'antd';
import ProductAutoComplete from './ProductAutoComplete';

const styles = {
  container: {
  },

  icon: {
    alignSelf: 'center',
    marginBottom: '0.5em',
  },

  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },

  productItem: {
    width: '80%',
    margin: '0em 0.5em 0.5em 0em',
    display: 'flex',
    flexDirection: 'column',
  },

  formItem: {
    margin: '0em 0.5em 0.5em 0em',
    overflow: 'hidden',

  },

};

class ProductItems extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>

        {
          !this.props.items ? null :
          this.props.items.map((obj, index) => {
            return (
              <div key={index}
                   style={styles.row}>
                <div style={styles.productItem}>
                  <ProductAutoComplete
                    onChange={this.props.onChange}
                    value={obj['product']}
                    index={index}
                  />
                </div>

                <div style={styles.formItem}>
                  <Input
                    placeholder="Unit Weight"
                    value={obj['unit_weight']}
                    onChange={ e => this.props.onChange('unit_weight', index, e.target.value) }
                  />
                </div>

                <div style={styles.formItem}>
                  <Input
                    placeholder="Case Lots"
                    value={obj['case_lots']}
                    onChange={ e => this.props.onChange('case_lots', index, e.target.value) }
                  />
                </div>

                <div style={styles.formItem}>
                  <Input
                    placeholder="Total Weight"
                    value={obj['total_weight']}
                    onChange={ e => this.props.onChange('total_weight', index, e.target.value) }
                  />
                </div>

                {this.props.items.length > 1 ? (
                   <Icon
                     className="dynamic-delete-button"
                     style={styles.icon}
                     type="minus-circle-o"
                     disabled={this.props.items.length === 1}
                     onClick={ () => this.props.removeProductItem(index) }
                   />
                ) : null}

              </div>
            );
          })
        }

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
