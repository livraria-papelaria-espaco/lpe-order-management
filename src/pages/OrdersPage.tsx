import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useHistory } from 'react-router-dom';
import OrderList from '../components/Orders/OrderList';
import routes from '../constants/routes';

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
  const history = useHistory();
  const classes = useStyles();

  return (
    <div>
      <OrderList />
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
