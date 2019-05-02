import React from 'react';
import withAuthorization from './withAuthorization';
import SignOutButton from './SignOut';
import { db } from '../firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import * as roles from '../constants/roles';
import * as routes from '../constants/routes';

import About from '../pages/about';
import Home from '../pages/home';
import Shipments from '../pages/shipments';
import Receipts from '../pages/receipts';
import Products from '../pages/products';
import Staff from '../pages/staff';
import Providers from '../pages/providers';
import Customers from '../pages/customers';
import Reports from '../pages/reports';
import Help from '../pages/help';

import './Dashboard.css';
import { Layout, Menu } from 'antd';
const { Header, Content, Sider, Footer } = Layout;

const styles = {
  layout: {
    display: 'flex',
    flex: 'column',
    minHeight: '100vh'
  },

  slider: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },

  header: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #EBEDF0'
  },

  footer: {
    width: '100%',
    padding: '1em',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    borderTop: '1px solid #EBEDF0',
    fontSize: 'small',
    color: '#595959',
    textAlign: 'center'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F0F2F5'
    //marginTop: "auto",
  },

  menu: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1%'
  },

  title: {
    fontSize: '2em',
    fontWeight: 'bold'
  },

  sliderTitle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    fontSize: '2.0em',
    fontWeight: 'bold'
    //fontStyle: 'italic',
  },

  signOutButton: {
    paddingTop: '.4%'
  }
};

const pages = {
  home: Home,
  shipments: Shipments,
  receipts: Receipts,
  products: Products,
  staff: Staff,
  providers: Providers,
  customers: Customers,
  reports: Reports,
  about: About,
  help: Help
};

const adminOnlyPages = {
  products: Products,
  staff: Staff
};

function cleanPathname(pathname) {
  let name = pathname.split('/')[2];
  name = name ? name : 'Home';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: cleanPathname(props.location.pathname),
      pages: { ...pages }
    };
  }

  componentDidMount() {
    // auto route to home page on login
    if (this.props.location.pathname === routes.DASHBOARD) {
      this.props.history.push(routes.HOME);
    }

    db.onceGetSpecifcUser(this.props.authUser.uid).then(snapshot => {
      const userData = snapshot.val();
      if (userData.role === roles.ADMIN) {
        this.setState({ pages: Object.assign(pages, adminOnlyPages) });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const currPathname = this.props.location.pathname;
    if (prevProps.location.pathname !== currPathname) {
      this.setState({ current: cleanPathname(currPathname) });
    }
  }

  handleClick = e => {
    const string = e.key;
    const upperCase = string.charAt(0).toUpperCase() + string.slice(1);
    this.setState({ current: upperCase });
  };

  render() {
    const { match } = this.props; // coming from React Router.

    return (
      <Router>
        <Layout>
          <Sider style={styles.slider}>
            <div style={styles.sliderTitle}>BMAC Warehouse</div>
            <Menu
              onClick={e => this.handleClick(e)}
              selectedKeys={[this.state.current]}
              mode="vertical"
              theme="dark"
              style={styles.menu}
            >
              {Object.keys(this.state.pages).map(name => {
                return (
                  <Menu.Item key={name}>
                    <Link to={`${match.url}/${name}`}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Sider>

          <Layout style={styles.layout}>
            <Header style={styles.header}>
              <span key="plsUpdate" style={styles.title}>
                {this.state.current}
              </span>
              <div style={styles.signOutButton}>
                <SignOutButton type="danger" />
              </div>
            </Header>

            <Content style={styles.content}>
              <Switch>
                {Object.keys(pages).map(name => {
                  return (
                    <Route
                      exact
                      path={`${match.path}/${name}`}
                      component={pages[name]}
                      key={name}
                    />
                  );
                })}
              </Switch>
            </Content>

            <Footer style={styles.footer}>
              Whitman Capstone Project 2018-2019
              <br />
              Copyright ©2019 Rajesh Narayan, Paul Milloy, Ben Limpich, Jules Choquart, and Pablo
              Fernandez
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
