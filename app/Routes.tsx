/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loading from './components/Loading';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

const LazyCustomersPage = React.lazy(() =>
  import(/* webpackChunkName: "CustomersPage" */ './containers/CustomersPage')
);

const CustomersPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyCustomersPage {...props} />
  </React.Suspense>
);

const LazyCustomerPage = React.lazy(() =>
  import(/* webpackChunkName: "CustomerPage" */ './containers/CustomerPage')
);

const CustomerPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyCustomerPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.CUSTOMER} component={CustomerPage} />
        <Route path={routes.CUSTOMERS} component={CustomersPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
