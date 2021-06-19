import { Button, makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import OrderCreateIcon from '@material-ui/icons/AddShoppingCartRounded';
import { useSnackbar } from 'notistack';

const { ipcRenderer } = require('electron');

type Props = {
  books: Record<string, number>;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default function CreateOrder({ books }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const submitOrder = useCallback(() => {
    ipcRenderer.once(
      'db-create-order-result',
      (_: never, args: number | boolean) => {
        if (args) {
          enqueueSnackbar(`Encomenda criada com sucesso!`, {
            variant: 'success',
          });
          // TODO send user to order page
        } else
          enqueueSnackbar(`Erro ao criar a encomenda.`, { variant: 'error' });
      }
    );
    ipcRenderer.send('db-create-order', 1, books, 'test order');
  }, [books, enqueueSnackbar]);

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<OrderCreateIcon />}
        onClick={submitOrder}
      >
        Criar Encomenda
      </Button>
    </div>
  );
}
