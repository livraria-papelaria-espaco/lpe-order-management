/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

const LazyCustomersPage = React.lazy(() =>
  import(/* webpackChunkName: "CustomersPage" */ './containers/CustomersPage')
);

const CustomersPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCustomersPage {...props} />
  </React.Suspense>
);

const LazyCustomerPage = React.lazy(() =>
  import(/* webpackChunkName: "CustomerPage" */ './containers/CustomerPage')
);

const CustomerPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCustomerPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.CUSTOMERS} component={CustomersPage} />
        <Route path={routes.CUSTOMER} component={CustomerPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}