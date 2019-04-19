/**
 *  A component
 */

import React from 'react';
import withAuthorization from '../../components/withAuthorization';

const styles = {
  container: {
    padding: 24,
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

const authCondition = (authUser) => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Help);
