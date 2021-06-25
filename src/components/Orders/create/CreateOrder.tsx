import { Button, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import OrderCreateIcon from '@material-ui/icons/AddShoppingCartRounded';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router';
import { Customer } from '../../../types/database';
import routes from '../../../constants/routes';

const { ipcRenderer } = require('electron');

type Props = {
  books: Record<string, number>;
  customer: Customer | null;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default function CreateOrder({ books, customer }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const submitOrder = useCallback(() => {
    ipcRenderer.once(
      'db-create-order-result',
      (_: never, args: number | boolean) => {
        if (args) {
          enqueueSnackbar(`Encomenda criada com sucesso!`, {
            variant: 'success',
          });
          history.push(routes.ORDERS);
        } else
          enqueueSnackbar(`Erro ao criar a encomenda.`, { variant: 'error' });
      }
    );
    ipcRenderer.send('db-create-order', customer?.id, books, 'test order');
  }, [books, customer?.id, enqueueSnackbar, history]);

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<OrderCreateIcon />}
        onClick={submitOrder}
        disabled={Object.keys(books).length === 0 || !customer}
      >
        Criar Encomenda
      </Button>
    </div>
  );
}
