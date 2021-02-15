import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import NewOrder from '../components/Orders/NewOrder';
import routes from '../constants/routes';

function AddOrder() {
  return <Link to={routes.ORDERS_NEW}>Nova Encomenda</Link>;
}

export default function OrdersPage() {
  return (
    <Switch>
      <Route path={routes.ORDERS_NEW} component={NewOrder} />
      <Route default component={AddOrder} />
    </Switch>
  );
}
