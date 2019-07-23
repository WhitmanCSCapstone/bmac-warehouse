import React from 'react';
import withAuthorization from './withAuthorization';
import LoadingScreen from './LoadingScreen';
import { db } from '../firebase';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { getTablePromise } from '../utils/misc';
import { table2Promise } from '../constants/constants';
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
import FundingSources from '../pages/fundingSources';
import AppHeader from './AppHeader';

import './Dashboard.css';
import { Layout, Menu } from 'antd';
const { Header, Content, Sider, Footer } = Layout;

const styles = {
  layout: {
    display: 'flex',
    flex: 'column',
    minHeight: '100vh'
  },

  header: {
    width: '100%',
    padding: '0px'
  },
  slider: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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

  sliderTitle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    fontSize: '2.0em',
    fontWeight: 'bold'
    //fontStyle: 'italic',
  }
};

const standardPages = {
  home: Home,
  shipments: Shipments,
  receipts: Receipts,
  providers: Providers,
  customers: Customers,
  reports: Reports,
  about: About,
  help: Help
};

const adminPages = {
  home: Home,
  shipments: Shipments,
  receipts: Receipts,
  products: Products,
  providers: Providers,
  customers: Customers,
  fundingSources: FundingSources,
  staff: Staff,
  reports: Reports,
  about: About,
  help: Help
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
      currentUserUid: this.props.authUser.uid,
      pages: { ...standardPages },
      shipments: null,
      receipts: null,
      products: null,
      providers: null,
      customers: null,
      fundingSources: null,
      users: null,
      initialLoadIsComplete: false
    };
  }

  refreshTables = (tables = [], optCallback = () => {}) => {
    for (const table of tables) {
      const promise = () => getTablePromise(table, optCallback);
      promise().then(data => {
        this.setState({ [table]: data });
      });
    }
  };

  componentDidMount() {
    this.refreshTables(Object.keys(table2Promise));

    // auto route to home page on login
    if (this.props.location.pathname === routes.DASHBOARD) {
      this.props.history.push(routes.HOME);
    }

    db.onceGetSpecifcUser(this.props.authUser.uid).then(snapshot => {
      const userData = snapshot.val();
      if (userData.role === roles.ADMIN) {
        this.setState({ pages: adminPages });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const currPathname = this.props.location.pathname;
    if (prevProps.location.pathname !== currPathname) {
      this.setState({ current: cleanPathname(currPathname) });
    }
    if (this.props.authUser.uid !== prevProps.authUser.uid) {
      this.setState({ currentUserUid: this.props.authUser.uid });

      db.onceGetSpecifcUser(this.props.authUser.uid).then(snapshot => {
        const userData = snapshot.val();
        if (userData.role === roles.ADMIN) {
          this.setState({ pages: adminPages });
        } else {
          this.setState({ pages: standardPages });
        }
      });
    }
  }

  handleClick = e => {
    const string = e.key;
    const upperCase = string.charAt(0).toUpperCase() + string.slice(1);
    this.setState({ current: upperCase });
  };

  hasLoaded = () => {
    const condition =
      !!this.state.shipments &&
      !!this.state.receipts &&
      !!this.state.products &&
      !!this.state.providers &&
      !!this.state.users &&
      !!this.state.customers &&
      !!this.state.fundingSources;
    return condition;
  };

  render() {
    const { match } = this.props; // coming from React Router.

    return (
      <Router>
        {!this.hasLoaded() ? (
          <LoadingScreen />
        ) : (
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
                        {name === 'fundingSources'
                          ? 'Funding Sources'
                          : name.charAt(0).toUpperCase() + name.slice(1)}
                      </Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Sider>

            <Layout style={styles.layout}>
              <Header style={styles.header}>
                <AppHeader
                  current={this.state.current}
                  users={this.state.users}
                  userUid={this.state.currentUserUid}
                />
              </Header>

              <Content style={styles.content}>
                <Switch>
                  {Object.keys(this.state.pages).map(name => {
                    return (
                      <Route
                        exact
                        path={`${match.path}/${name}`}
                        render={props => {
                          const Component = this.state.pages[name];
                          return (
                            <Component
                              {...props}
                              shipments={this.state.shipments}
                              receipts={this.state.receipts}
                              products={this.state.products}
                              providers={this.state.providers}
                              customers={this.state.customers}
                              users={this.state.users}
                              fundingSources={this.state.fundingSources}
                              refreshTables={this.refreshTables}
                            />
                          );
                        }}
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
        )}
      </Router>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Dashboard);
