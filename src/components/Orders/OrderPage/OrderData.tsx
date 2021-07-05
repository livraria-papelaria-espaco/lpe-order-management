import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';
import { Order } from '../../../types/database';
import { moveOrderToNextStatus } from '../../../utils/api';
import OrderStatusChip from '../OrderStatusChip';
import OrderBookList from './OrderBookList';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
  },
  nextStatusBtn: {
    margin: theme.spacing(1),
  },
}));

interface Props {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order | undefined>>;
}

export default function OrderData({ order, setOrder }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleNextStatus = useCallback(async () => {
    const newStatus = await moveOrderToNextStatus(order.id);

    if (!newStatus) {
      enqueueSnackbar('Erro ao mudar o estado da encomenda', {
        variant: 'error',
      });
      return;
    }

    setOrder({ ...order, status: newStatus });
    enqueueSnackbar('Estado alterado com sucesso', { variant: 'success' });
  }, [enqueueSnackbar, order, setOrder]);

  return (
    <div>
      <Typography variant="h4" className={classes.card}>
        Encomenda #{order.id}
      </Typography>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Informação</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6">Cliente</Typography>
              <Typography>
                {order.customer?.name || 'Nome Desconhecido'}
              </Typography>
              <Typography>{order.customer?.phone}</Typography>
              <Typography>{order.customer?.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6">Estado</Typography>
              <OrderStatusChip status={order.status} />
              {order.status === 'ready' && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNextStatus}
                  className={classes.nextStatusBtn}
                >
                  Marcar como avisado
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6">Data de Encomenda</Typography>
              <Typography>{order.created_at}</Typography>
              <Typography color="textSecondary">
                Última atualização a {order.updated_at}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Observações</Typography>
          <TextField
            value={order.notes}
            InputProps={{
              readOnly: true,
            }}
            multiline
            variant="outlined"
            fullWidth
          />
        </CardContent>
      </Card>
      <OrderBookList books={order.books || []} />
    </div>
  );
}
