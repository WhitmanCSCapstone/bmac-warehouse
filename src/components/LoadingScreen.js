/**
 *  A component
 */

import React from 'react';
import { Spin } from 'antd';

const styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  text: {
    marginLeft: '0.5em',
    fontSize: 'x-large',
    fontWeight: 'bold'
  }
};

class LoadingScreen extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <Spin size="large" />
        <span style={styles.text}>Loading...</span>
      </div>
    );
  }
}

export default LoadingScreen;
