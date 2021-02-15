import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { SnackbarProvider } from 'notistack';
import routes from './constants/routes';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import BooksPage from './pages/BooksPage';
import HomePage from './pages/HomePage';
import Root from './pages/Root';
import BookPage from './pages/BookPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <SnackbarProvider autoHideDuration={8000}>
      <Router>
        <Root>
          <Switch>
            <Route path={routes.CUSTOMER} component={CustomerPage} />
            <Route path={routes.CUSTOMERS} component={CustomersPage} />
            <Route path={routes.BOOK} component={BookPage} />
            <Route path={routes.BOOKS} component={BooksPage} />
            <Route path={routes.ORDERS} component={OrdersPage} />
            <Route path={routes.HOME} component={HomePage} />
          </Switch>
        </Root>
      </Router>
    </SnackbarProvider>
  );
}
