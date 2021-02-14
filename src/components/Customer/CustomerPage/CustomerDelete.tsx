import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useHistory } from 'react-router';

const { ipcRenderer } = require('electron');

type Props = {
  id: number;
};

export default function CustomerDelete({ id }: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    ipcRenderer.once('db-result-customer-delete', (_, success) => {
      if (success) {
        enqueueSnackbar('Cliente eliminado com sucesso', {
          variant: 'success',
        });
        history.goBack();
        return;
      }
      enqueueSnackbar(
        'Erro ao eliminar clientes: um cliente não pode ser eliminado se tiver encomendas associadas!',
        { variant: 'error' }
      );
    });
    ipcRenderer.send('db-customer-delete', id);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-delete-customer-title"
        aria-describedby="alert-dialog-delete-customer-description"
      >
        <DialogTitle id="alert-dialog-delete-customer-title">
          Tem a certeza que quer eliminar este cliente?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-customer-description">
            Esta ação não pode ser revertida. Um cliente não pode ser eliminado
            se tiver encomendas associadas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
