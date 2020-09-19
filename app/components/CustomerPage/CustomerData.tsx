import {
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditRounded';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import SaveIcon from '@material-ui/icons/SaveRounded';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Customer } from '../../types/database';

const { ipcRenderer } = window.require('electron');

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
    setEdit(false);
  };

  useEffect(() => {
    ipcRenderer.on('db-result-customer-update', (_, success) => {
      if (success)
        enqueueSnackbar('Alterações efetuadas com sucesso!', {
          variant: 'success',
        });
      else enqueueSnackbar('Erro ao guardar alterações', { variant: 'error' });
    });
  }, [enqueueSnackbar]);

  return (
    <Paper className={classes.paper}>
      <div className={classes.toolbar}>
        <Typography variant="h4" className={classes.title}>
          {customer?.name || 'Cliente'}
        </Typography>
        <IconButton onClick={toggleEdit} color="secondary">
          {edit ? <SaveIcon /> : <EditIcon />}
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
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
