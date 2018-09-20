/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class About extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>



      
        Hello there! This is the about page!
      </div>
    );
  }
}

export default About;
