/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Shipments extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the shipments page!
      </div>
    );
  }
}

export default Shipments;
