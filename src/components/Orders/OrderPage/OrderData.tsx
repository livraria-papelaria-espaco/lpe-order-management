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
import React, { useCallback, useState } from 'react';
import { Order } from '../../../types/database';
import { moveOrderToNextStatus, updateOrder } from '../../../utils/api';
import OrderStatusChip from '../OrderStatusChip';
import OrderBookList from './OrderBookList';
import PickupBooksDialog from './PickupBooksDialog';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
  },
  nextStatusBtn: {
    margin: theme.spacing(1),
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  order: Order;
  updateHook(): void;
}

export default function OrderData({ order, updateHook }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false);

  const togglePickupDialog = () => setPickupDialogOpen((state) => !state);

  const handleNextStatus = useCallback(async () => {
    const newStatus = await moveOrderToNextStatus(order.id);

    if (!newStatus) {
      enqueueSnackbar('Erro ao mudar o estado da encomenda', {
        variant: 'error',
      });
      return;
    }

    updateHook();
    enqueueSnackbar('Estado alterado com sucesso', { variant: 'success' });
  }, [enqueueSnackbar, order, updateHook]);

  const handleNotesChange = useCallback(
    async (event) => {
      const success = await updateOrder({
        id: order.id,
        notes: event.target.value,
      });

      if (!success) {
        enqueueSnackbar('Erro ao atualizar as observações da encomenda', {
          variant: 'error',
        });
        return;
      }

      updateHook();
      enqueueSnackbar('Observações da encomenda atualizadas', {
        variant: 'success',
      });
    },
    [enqueueSnackbar, order.id, updateHook]
  );

  return (
    <div>
      <div className={classes.headerBar}>
        <Typography variant="h4" className={classes.card}>
          Encomenda #{order.id}
        </Typography>
        <Button color="primary" variant="outlined" onClick={togglePickupDialog}>
          Levantamento de Produtos
        </Button>
        <PickupBooksDialog
          order={order}
          open={pickupDialogOpen}
          handleToggle={togglePickupDialog}
          updateHook={updateHook}
        />
      </div>
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
              <OrderStatusChip status={order.status ?? 'pending'} />
              {order.status === 'ready' && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNextStatus}
                  className={classes.nextStatusBtn}
                >
                  Marcar como notificado
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6">Data de Encomenda</Typography>
              <Typography>
                {order.created_at?.toLocaleString('pt-PT')}
              </Typography>
              <Typography color="textSecondary">
                Última atualização a {order.updated_at?.toLocaleString('pt-PT')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Observações</Typography>
          <TextField
            defaultValue={order.notes}
            onBlur={handleNotesChange}
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
