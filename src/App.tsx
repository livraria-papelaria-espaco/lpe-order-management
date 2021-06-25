import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import routes from './constants/routes';
import BookPage from './pages/BookPage';
import BooksPage from './pages/BooksPage';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import OrderNewPage from './pages/OrderNewPage';
import OrdersPage from './pages/OrdersPage';
import Root from './pages/Root';

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
            <Route path={routes.ORDERS_NEW} component={OrderNewPage} />
            <Route path={routes.ORDERS} component={OrdersPage} />
            <Route path={routes.HOME} component={HomePage} />
          </Switch>
        </Root>
      </Router>
    </SnackbarProvider>
  );
}
