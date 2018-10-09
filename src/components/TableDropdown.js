/**
 *  A component
 */

import React from 'react';

const styles = {
  container: {
  },
};

class TableDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return(
      <div style={styles.container}>
        this is the dropdown component
      </div>
    );
  }
}

export default TableDropdown;
