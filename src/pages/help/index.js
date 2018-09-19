/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Help extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the help page!
      </div>
    );
  }
}

export default Help;
