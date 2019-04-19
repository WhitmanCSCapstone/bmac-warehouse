import React from 'react';
import withAuthentication from './withAuthentication';
import {
  BrowserRouter as Router, // hash router????????
  Route,
  Switch,
} from 'react-router-dom';
import { firebase } from '../firebase';

import Navigation from './Navigation';
import LandingPage from './Landing';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import Dashboard from './Dashboard';
import AccountPage from './Account';
import Error from './Error';

import * as routes from '../constants/routes';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      confirmedAuthStatus: false,
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
      ? this.setState({ authUser: authUser,
                        confirmedAuthStatus: true })
      : this.setState({ authUser: null,
                        confirmedAuthStatus: true });
    });
  }

  render() {
    return(
      <Router>
        <div>
          {this.state.authUser === null && this.state.confirmedAuth && <Navigation />}
          <Switch>
            <Route exact path={routes.LANDING} component={LandingPage} />
            <Route exact path={routes.SIGN_IN} component={SignInPage} />
            <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={routes.DASHBOARD} component={Dashboard} />
            <Route exact path={routes.ACCOUNT} component={AccountPage} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
