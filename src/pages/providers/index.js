/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Providers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the Providers Page!
      </div>
    );
  }
}

export default Providers;
