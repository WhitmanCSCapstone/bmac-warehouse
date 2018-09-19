/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Receipts extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the receipts page!
      </div>
    );
  }
}

export default Receipts;
