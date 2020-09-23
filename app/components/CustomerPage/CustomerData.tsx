import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditRounded';
import SaveIcon from '@material-ui/icons/SaveRounded';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Customer } from '../../types/database';
import CustomerDelete from './CustomerDelete';

const { ipcRenderer } = require('electron');

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  toolbar: {
    display: 'flex',
    // flexDirection: 'row-reverse',
    paddingBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

type Props = {
  customer: Customer;
};

export default function CustomerData({ customer }: Props) {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(customer?.name);
  const [phone, setPhone] = useState(customer?.phone);
  const [email, setEmail] = useState(customer?.email);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fn: React.Dispatch<React.SetStateAction<string>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const toggleEdit = () => {
    if (!edit) {
      setEdit(true);
      return;
    }
    ipcRenderer.send('db-customer-update', {
      id: customer.id,
      name,
      phone,
      email,
    });
    ipcRenderer.once('db-result-customer-update', (_, success) => {
      if (success) {
        enqueueSnackbar('Alterações efetuadas com sucesso!', {
          variant: 'success',
        });
        return;
      }
      enqueueSnackbar('Já existe um cliente com esse telemóvel e/ou email!', {
        variant: 'error',
      });
      setName(customer?.name);
      setPhone(customer?.phone);
      setEmail(customer?.email);
    });
    setEdit(false);
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.toolbar}>
        <div className={classes.title}>
          <Typography variant="h4">{name || 'Cliente'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {`Adicionado em ${customer.created_at.toLocaleString(
              'pt-PT'
            )} | Última atualização em ${customer.updated_at.toLocaleString(
              'pt-PT'
            )}`}
          </Typography>
        </div>
        <div>
          <IconButton onClick={toggleEdit} color="secondary">
            {edit ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          <CustomerDelete id={customer?.id} />
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nome"
            value={name}
            onChange={handleChange(setName)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
            focused={edit}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Telemóvel"
            value={phone}
            onChange={handleChange(setPhone)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            value={email}
            onChange={handleChange(setEmail)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
