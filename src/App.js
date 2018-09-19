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

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} alt="logo" />
            <h1 className="App-title">Welcome to BMAC-Warehouse</h1>

            <Link to="/home">
              <button>Home</button>
            </Link>
            <Link to="/about">
              <button>About</button>
            </Link>
            <Link to="/shipments">
              <button>Shipments</button>
            </Link>
            <Link to="/receipts">
              <button>Receipts</button>
            </Link>
            <Link to="products">
              <button>Products</button>
            </Link>
            <Link to="staff">
              <button>Staff</button>
            </Link>
            <Link to="providers">
              <button>Providers</button>
            </Link>
            <Link to="customers">
              <button>Customers</button>
            </Link>
            <Link to="reports">
              <button>Reports</button>
            </Link>
            <Link to="help">
              <button>Help</button>
            </Link>

          </header>

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

        </div>
      </Router>
    );
  }
}

export default App;
