import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import OrderList from '../components/Orders/OrderList';
import routes from '../constants/routes';
import { Order } from '../types/database';
import { fetchOrders } from '../utils/api';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  return (
    <div>
      <OrderList orders={orders} />
      <Fab
        variant="extended"
        color="secondary"
        className={classes.fab}
        onClick={() => history.push(routes.ORDERS_NEW)}
      >
        <AddIcon className={classes.extendedIcon} />
        Nova Encomenda
      </Fab>
    </div>
  );
}
