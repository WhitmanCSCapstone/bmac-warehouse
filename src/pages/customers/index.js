/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Customers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the customers page!
      </div>
    );
  }
}

export default Customers;
