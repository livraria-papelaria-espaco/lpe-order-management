import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { SnackbarProvider } from 'notistack';
import routes from './constants/routes.json';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import Root from './pages/Root';

export default function App() {
  return (
    <SnackbarProvider autoHideDuration={8000}>
      <Router>
        <Root>
          <Switch>
            <Route path={routes.CUSTOMER} component={CustomerPage} />
            <Route path={routes.CUSTOMERS} component={CustomersPage} />
            <Route path={routes.HOME} component={HomePage} />
          </Switch>
        </Root>
      </Router>
    </SnackbarProvider>
  );
}
