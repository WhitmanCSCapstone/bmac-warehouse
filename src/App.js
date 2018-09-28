import React, { Component } from 'react';
import logo from './bmac_logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import About from './pages/about';
import Home from './pages/home';
import Shipments from './pages/shipments';
import Receipts from './pages/receipts';
import Products from './pages/products';
import Staff from './pages/staff';
import Providers from './pages/providers';
import Customers from './pages/customers';
import Reports from './pages/reports';
import Help from './pages/help';
import { Layout, Button, Menu } from 'antd';


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
    backgroundColor: "#F0F2F5",
    textAlign: "center",
  },

  menu: {
  },

  title: {
    paddingRight: "50px",
    fontSize: "2em",
  },
}

class App extends Component {
  state = {
    // this should be "home" but currently the app doesn't
    // auto-route to the home page, so for now this is null
    current: null,
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <Router>
        <Layout style={styles.layout}>
          <Header style={styles.header}>

            {
              /*
                logo for BMAC, but its kinda ugly and hard to fit in
                so for right now its just gonna be commented out
                <img src={logo} />
              */
            }

            <em style={styles.title}>BMAC-Warehouse</em>

            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              theme="light"
              style={styles.menu}
            >

              <Menu.Item key="home">
                <Link to="/home">Home</Link>
              </Menu.Item>
              <Menu.Item key="about">
                <Link to="/about">About</Link>
              </Menu.Item>
              <Menu.Item key="shipments">
                <Link to="/shipments"> Shipments</Link>
              </Menu.Item>
              <Menu.Item key="receipts">
                <Link to="/receipts">Receipts</Link>
              </Menu.Item>
              <Menu.Item key="products">
                <Link to="products">Products</Link>
              </Menu.Item>
              <Menu.Item key="staff">
                <Link to="staff">Staff</Link>
              </Menu.Item>
              <Menu.Item key="providers">
                <Link to="providers">Providers</Link>
              </Menu.Item>
              <Menu.Item key="customers">
                <Link to="customers">Customers</Link>
              </Menu.Item>
              <Menu.Item key="reports">
                <Link to="reports">Reports</Link>
              </Menu.Item>
              <Menu.Item key="help">
                <Link to="help">Help</Link>
              </Menu.Item>

            </Menu>

          </Header>

          <Content style={styles.content}>

            <Route exact path="/about" component={About} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/shipments" component={Shipments} />
            <Route exact path="/receipts" component={Receipts} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/staff" component={Staff} />
            <Route exact path="/providers" component={Providers} />
            <Route exact path="/customers" component={Customers} />
            <Route exact path="/reports" component={Reports} />
            <Route exact path="/help" component={Help} />

          </Content>

          <Footer style={styles.footer}>
            Whitman Capstone Project 2019 <br/>
            Copyright ©2018 Rajesh Narayan, Paul Milloy, Ben Limpich, Jules Choquart, and Pablo Fernandez
          </Footer>

        </Layout>

      </Router>

    );
  }
}

export default App;
