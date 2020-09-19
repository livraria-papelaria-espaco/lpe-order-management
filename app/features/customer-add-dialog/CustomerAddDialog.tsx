import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

const { ipcRenderer } = window.require('electron');

type Props = {
  open: boolean;
  handleClose(): void;
};

export default function CustomerAddDialog({ open, handleClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fn: React.Dispatch<React.SetStateAction<string>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const handleSubmit = () => {
    handleClose();
    if (name) {
      ipcRenderer.send('db-customers-insert', { name, phone, email });
      setName('');
      setPhone('');
      setEmail('');
    }
  };

  useEffect(() => {
    ipcRenderer.on('db-result-customers-insert', (_, args) => {
      if (args)
        enqueueSnackbar(`Cliente adicionado com sucesso!`, {
          variant: 'success',
        });
      else
        enqueueSnackbar(
          `Erro ao adicionar o cliente. Telemóvel ou email já existem na base de dados.`,
          { variant: 'error' }
        );
    });
  }, []);

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
            placeholder="examplo@examplo.com"
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
}
