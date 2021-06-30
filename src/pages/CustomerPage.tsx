import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import BackButton from '../components/BackButton';
import CustomerData from '../components/Customer/CustomerPage/CustomerData';
import Loading from '../components/Loading';
import { CustomerPage, CustomerQueryResult } from '../types/database';

const { ipcRenderer } = require('electron');

type ParamType = {
  id: string | undefined;
};

export default function CustomersPage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<CustomerPage>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    ipcRenderer.send('db-customer-find-one', id);
    ipcRenderer.once(
      'db-result-customer-find-one',
      (_: never, response: CustomerQueryResult) => {
        if (!response) {
          enqueueSnackbar('Cliente não encontrado', { variant: 'error' });
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
      <CustomerData customer={data?.customer} />
    </div>
  );
}
