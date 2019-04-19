import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase, db } from '../firebase';
import * as routes from '../constants/routes';
import * as roles from '../constants/roles';

const withAuthorization = (authCondition, adminOnly) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
        if (adminOnly) {
          db.onceGetSpecifcUser(authUser.uid).then((snapshot) => {
            const userData = snapshot.val();
            if (userData.role !== roles.ADMIN) {
              this.props.history.push(routes.HOME);
            }
          });
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component {...this.props} /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;
