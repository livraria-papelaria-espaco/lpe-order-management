import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import routes from './constants/routes';
import BookPage from './pages/BookPage';
import BooksPage from './pages/BooksPage';
import CustomerPage from './pages/CustomerPage';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import OrderNewPage from './pages/OrderNewPage';
import OrdersPage from './pages/OrdersPage';
import Root from './pages/Root';
import OrderPage from './pages/OrderPage';
import DistributorConfigurationPage from './pages/DistributorConfigurationPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#273377',
    },
    secondary: {
      main: '#f39524',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider autoHideDuration={8000}>
        <Router>
          <Root>
            <Switch>
              <Route path={routes.CUSTOMER} component={CustomerPage} />
              <Route path={routes.CUSTOMERS} component={CustomersPage} />
              <Route path={routes.BOOK} component={BookPage} />
              <Route path={routes.BOOKS} component={BooksPage} />
              <Route path={routes.ORDERS_NEW} component={OrderNewPage} />
              <Route path={routes.ORDER} component={OrderPage} />
              <Route path={routes.ORDERS} component={OrdersPage} />
              <Route
                path={routes.EXTERNAL_ORDER_SETTINGS}
                component={DistributorConfigurationPage}
              />
              <Route path={routes.HOME} component={HomePage} />
            </Switch>
          </Root>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
