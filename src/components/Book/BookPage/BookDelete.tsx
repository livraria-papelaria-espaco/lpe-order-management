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
  id: string;
};

export default function BookDelete({ id }: Props) {
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
    ipcRenderer.once('db-result-book-delete', (_: never, success: boolean) => {
      if (success) {
        enqueueSnackbar('Livro eliminado com sucesso', {
          variant: 'success',
        });
        history.goBack();
        return;
      }
      enqueueSnackbar(
        'Erro ao eliminar livro: um livro não pode ser eliminado se tiver encomendas associadas!',
        { variant: 'error' }
      );
    });
    ipcRenderer.send('db-book-delete', id);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-delete-book-title"
        aria-describedby="alert-dialog-delete-book-description"
      >
        <DialogTitle id="alert-dialog-delete-book-title">
          Tem a certeza que quer eliminar este livro?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-book-description">
            Esta ação não pode ser revertida. Um livro não pode ser eliminado se
            tiver encomendas associadas.
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
