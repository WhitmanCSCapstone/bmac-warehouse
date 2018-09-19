/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the home page!
      </div>
    );
  }
}

export default Home;
