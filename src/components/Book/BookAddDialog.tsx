import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
} from '@material-ui/core';
import AutoFillIcon from '@material-ui/icons/SearchRounded';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { fetchBookMetadata } from '../../utils/api';
import { isISBN } from '../../utils/books';

const { ipcRenderer } = require('electron');

type Props = {
  open: boolean;
  handleClose(): void;
};

export default function BookAddDialog({ open, handleClose }: Props) {
  const [isbn, setISBN] = useState('');
  const [name, setName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [type, setType] = useState('other');
  const [schoolYear, setSchoolYear] = useState('');
  const [codePe, setCodePe] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fn: React.Dispatch<React.SetStateAction<string>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (name) {
      ipcRenderer.once(
        'db-result-books-insert',
        (_: never, args: number | boolean) => {
          if (args) {
            handleClose();
            enqueueSnackbar(`Livro adicionado com sucesso!`, {
              variant: 'success',
            });
            setISBN('');
            setName('');
            setPublisher('');
            setType('other');
            setSchoolYear('');
            setCodePe('');
            setStock('');
          } else
            enqueueSnackbar(
              `Erro ao adicionar o Livro. ISBN já existe na base de dados.`,
              { variant: 'error' }
            );
        }
      );
      ipcRenderer.send('db-books-insert', {
        isbn,
        name,
        publisher,
        type,
        schoolYear,
        codePe,
        stock,
      });
    }
  };

  const fetchMetadata = async () => {
    if (isbn) {
      setLoading(true);

      const result = await fetchBookMetadata(isbn);

      setLoading(false);
      if (!result) {
        enqueueSnackbar(
          `Não foi possível preencher automaticamente informação para este livro.`,
          { variant: 'error' }
        );
        return;
      }
      setISBN(result.isbn ?? isbn);
      setName(result.name ?? name);
      setPublisher(result.publisher ?? publisher);
      setType(result.type ?? type);
      setSchoolYear((result.schoolYear ?? schoolYear).toString());
      setCodePe(result.codePe ?? codePe);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form>
        <DialogTitle id="form-dialog-title">Adicionar Livro</DialogTitle>
        <DialogContent>
          {loading && <LinearProgress />}
          <TextField
            autoFocus
            value={isbn}
            error={isbn.length > 0 && !isISBN(isbn)}
            onChange={handleChange(setISBN)}
            margin="dense"
            label="ISBN"
            type="text"
            placeholder="978XXXXXXXXXX"
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="fetch metadata"
                    onClick={fetchMetadata}
                    disabled={loading}
                  >
                    <AutoFillIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            value={name}
            onChange={handleChange(setName)}
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
          />
          <TextField
            value={publisher}
            onChange={handleChange(setPublisher)}
            margin="dense"
            label="Editora"
            type="text"
            fullWidth
          />
          <TextField
            value={type}
            select
            onChange={handleChange(setType)}
            margin="dense"
            label="Tipo"
            type="text"
            fullWidth
          >
            <MenuItem value="manual">Manual</MenuItem>
            <MenuItem value="ca">Caderno de Atividades</MenuItem>
            <MenuItem value="other">Não Escolar</MenuItem>
          </TextField>
          <TextField
            value={schoolYear}
            onChange={handleChange(setSchoolYear)}
            margin="dense"
            label="Ano Escolar"
            type="number"
            fullWidth
          />
          <TextField
            value={codePe}
            onChange={handleChange(setCodePe)}
            margin="dense"
            label="Código Porto Editora"
            type="text"
            fullWidth
          />
          <TextField
            value={stock}
            onChange={handleChange(setStock)}
            margin="dense"
            label="Stock Disponível para Venda"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            type="submit"
            disabled={!isISBN(isbn)}
          >
            Adicionar Livro
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
