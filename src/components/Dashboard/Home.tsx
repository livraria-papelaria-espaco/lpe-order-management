import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { orderStatus } from '../../constants/enums';
import { Order, OrderStatus } from '../../types/database';
import OrderList from '../Orders/OrderList';
import OverviewCard from './OverviewCard';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  overviewData: Record<OrderStatus, string>;
  readyOrders: Order[];
  notifiedOrders: Order[];
}

export default function Home({
  overviewData,
  readyOrders,
  notifiedOrders,
}: Props): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <OverviewCard
            color={orderStatus.pending.color}
            title="Em Processamento"
            value={overviewData?.pending || 0}
          />
        </Grid>
        <Grid item xs={3}>
          <OverviewCard
            color={orderStatus.ready.color}
            title="Por Notificar"
            value={overviewData?.ready || 0}
          />
        </Grid>
        <Grid item xs={3}>
          <OverviewCard
            color={orderStatus.notified.color}
            title="Notificadas"
            value={overviewData?.notified || 0}
          />
        </Grid>
        <Grid item xs={3}>
          <OverviewCard
            color={orderStatus.finished.color}
            title="Finalizadas"
            value={overviewData?.finished || 0}
          />
        </Grid>
      </Grid>
      {readyOrders.length > 0 && (
        <>
          <Typography variant="h4" gutterBottom className={classes.title}>
            Encomendas Por Notificar
          </Typography>
          <OrderList orders={readyOrders} />
        </>
      )}
      {notifiedOrders.length > 0 && (
        <>
          <Typography variant="h4" gutterBottom className={classes.title}>
            Encomendas Notificadas
          </Typography>
          <OrderList orders={notifiedOrders} />
        </>
      )}
    </div>
  );
}
