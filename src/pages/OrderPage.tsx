import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import OrderData from '../components/Orders/OrderPage/OrderData';
import { Order } from '../types/database';

const { ipcRenderer } = require('electron');

type ParamType = {
  id: string | undefined;
};

export default function OrderOnePage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<Order>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    ipcRenderer.send('db-order-find-one', id);
    ipcRenderer.once(
      'db-result-order-find-one',
      (_: never, response: Order | false) => {
        if (!response) {
          enqueueSnackbar('Encomenda não encontrada', { variant: 'error' });
          history.goBack();
          return;
        }
        setData(response);
      }
    );
  }, [enqueueSnackbar, history, id]);

  if (!data) return <Loading />;

  return (
    <div>
      <BackButton />
      <OrderData order={data} setOrder={setData} />
    </div>
  );
}
