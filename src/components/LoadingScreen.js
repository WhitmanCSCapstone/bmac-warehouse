/**
 *  A component
 */

import React from 'react';
import { Spin } from 'antd' ;

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

class LoadingScreen extends React.Component {
  render() {
    return(
      <div style={styles.container}>
        <Spin size="large"/>
      </div>
    );
  }
}

export default LoadingScreen;
