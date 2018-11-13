import React from 'react';
import withAuthorization from './withAuthorization';
import SignOutButton from './SignOut';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';

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
import SignOut from '../components/SignOut';

import './Dashboard.css';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

const styles = {
  layout: {
    display: "flex",
    flex: "column",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    borderBottom: "1px solid #EBEDF0",
  },

  footer: {
    width: "100%",
    padding: "1em",
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderTop: "1px solid #EBEDF0",
    fontSize: "small",
    color: "#595959",
    textAlign: "center",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F0F2F5",
  },

  menu: {
  },

  title: {
    paddingRight: "50px",
    fontSize: "2em",
  },
}

const pages = {
  home: Home,
  about: About,
  shipments: Shipments,
  receipts: Receipts,
  products: Products,
  staff: Staff,
  providers: Providers,
  customers: Customers,
  reports: Reports,
  help: Help,
}

class Dashboard extends React.Component {
  state = {
    // this should be "home" but currently the app doesn't
    // auto-route to the home page, so for now this is null
    current: null,
  }

  componentDidMount() {
    console.log('Dashboard Mounted');
  }

  render(){

    const { match } = this.props // coming from React Router.

    return(
      <Router>

        <Layout style={styles.layout}>

          <Header style={styles.header}>
            <em style={styles.title}>BMAC-Warehouse</em>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              theme="light"
              style={styles.menu}
            >
              {Object.keys(pages).map((name) => {
                 return(
                   <Menu.Item key={name}>
                     <Link to={`${match.url}/${name}`}>
                       {name.charAt(0).toUpperCase() + name.slice(1)}
                     </Link>
                   </Menu.Item>
                   );
              })}
            </Menu>
            <SignOutButton type="danger"/>
          </Header>

          <Content style={styles.content}>
            <Switch>
              {Object.keys(pages).map((name) => {
                 return(
                   <Route exact path={`${match.path}/${name}`} component={pages[name]} key={name} />
                 )
              })}
            </Switch>
          </Content>

          <Footer style={styles.footer}>
            Whitman Capstone Project 2019 <br/>
            Copyright ©2018 Rajesh Narayan, Paul Milloy, Ben Limpich, Jules Choquart, and Pablo Fernandez
          </Footer>

        </Layout>

      </Router>
    );
  }
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Dashboard);
