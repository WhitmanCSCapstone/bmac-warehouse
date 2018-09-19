/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Staff extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the staff page!
      </div>
    );
  }
}

export default Staff;
