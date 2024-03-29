import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Customer } from '../../types/database';

const { ipcRenderer } = require('electron');

type Props = {
  open: boolean;
  handleClose(): void;
  createdCallback?(customer: Customer): void;
};

const CustomerAddDialog = ({ open, handleClose, createdCallback }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fn: React.Dispatch<React.SetStateAction<string>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (name) {
      ipcRenderer.once(
        'db-result-customers-insert',
        (_: never, args: number | false) => {
          if (args) {
            handleClose();
            enqueueSnackbar(`Cliente adicionado com sucesso!`, {
              variant: 'success',
            });
            if (createdCallback) {
              createdCallback({ id: args, name, phone, email });
            }
            setName('');
            setPhone('');
            setEmail('');
          } else
            enqueueSnackbar(
              `Erro ao adicionar o cliente. Telemóvel ou email já existem na base de dados.`,
              { variant: 'error' }
            );
        }
      );
      ipcRenderer.send('db-customers-insert', { name, phone, email });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form>
        <DialogTitle id="form-dialog-title">Adicionar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={name}
            onChange={handleChange(setName)}
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            required
          />
          <TextField
            value={phone}
            onChange={handleChange(setPhone)}
            margin="dense"
            label="Telemóvel"
            type="tel"
            placeholder="912345678"
            fullWidth
          />
          <TextField
            value={email}
            onChange={handleChange(setEmail)}
            margin="dense"
            label="Email"
            type="email"
            placeholder="exemplo@exemplo.com"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" type="submit">
            Adicionar Cliente
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CustomerAddDialog.defaultProps = {
  createdCallback: null,
};

export default CustomerAddDialog;
