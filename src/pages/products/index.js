/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Products extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the Products page!
      </div>
    );
  }
}

export default Products;
