import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <App />,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <NextApp />,
      rootEl,
    );
  });
}
