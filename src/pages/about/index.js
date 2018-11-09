/**
 *  A component
 */

import React from 'react';
import withAuthorization from '../../components/withAuthorization';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '40rem',
    paddingTop: '2em',
    alignSelf: 'center',
    //fontSize: '1.5em',
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
        <p>BMAC Warehouse is a web-based warehouse inventory management system developed by Ben Limpich, Rajesh Narayan, Pablo Fernandez, Paul Milloy, and Jules Choquart. We are all senior Computer Science students at Whitman College during the 2018-2019 school year and we are building this application off of the previous work done by Moustafa El Badry, Noah Jensen, Dylan Martin, Luis Munguia Orta, David Quennoz, and Professor Allen Tucker. We, the students, were given a list of projects to work on as our senior “Capstone” project, and we chose to work on this one. Our advisor is the chair of the Computer Science department at Whitman, Janet Davis.</p>

        <p>The application itself is open-source and can be accessed on its Github repository <a href="https://github.com/WhitmanCSCapstone/bmac-warehouse">here</a>. Its built using React for the front-end, and has a NoSQL database hosted on Google’s Firebase.</p>

      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(About);
