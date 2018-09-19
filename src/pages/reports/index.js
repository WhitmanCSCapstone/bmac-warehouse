/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class Reports extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        This is the Reports page!
      </div>
    );
  }
}

export default Reports;
