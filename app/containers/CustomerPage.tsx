import { Button, makeStyles } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import CustomerData from '../components/CustomerPage/CustomerData';
import Loading from '../components/Loading';
import { CustomerPage } from '../types/database';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginBottom: theme.spacing(2),
  },
}));

type ParamType = {
  id: string | undefined;
};

export default function CustomersPage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<CustomerPage>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    ipcRenderer.send('db-customer-find-one', id);
    ipcRenderer.once('db-result-customer-find-one', (_, response) => {
      if (!response) {
        enqueueSnackbar('Cliente não encontrado', { variant: 'error' });
        history.goBack();
        return;
      }
      setData(response);
    });
  }, [enqueueSnackbar, history, id]);

  if (!data) return <Loading />;

  return (
    <div>
      <Button
        onClick={() => history.goBack()}
        startIcon={<BackIcon />}
        className={classes.backButton}
      >
        VOLTAR
      </Button>
      <CustomerData customer={data?.customer} />
    </div>
  );
}
