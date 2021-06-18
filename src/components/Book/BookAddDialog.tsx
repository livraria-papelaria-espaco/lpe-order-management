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
import { BookQueryResult } from '../../types/database';

const { ipcRenderer } = require('electron');

type Props = {
  open: boolean;
  handleClose(): void;
};

const isISBN = (isbn: string) => {
  if (!isbn || isbn.length !== 13 || !isbn.startsWith('978')) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i], 10);
    if (i % 2 === 1) sum += 3 * digit;
    else sum += digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[isbn.length - 1], 10);
};

export default function BookAddDialog({ open, handleClose }: Props) {
  const [isbn, setISBN] = useState('');
  const [name, setName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [provider, setProvider] = useState('');
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
            setProvider('');
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
        provider,
        type,
        schoolYear,
        codePe,
        stock,
      });
    }
  };

  const fetchMetadata = () => {
    if (isbn) {
      setLoading(true);
      ipcRenderer.send('utils-book-get-metadata', isbn);
      ipcRenderer.once(
        'utils-result-book-get-metadata',
        (_: never, result: BookQueryResult) => {
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
          setProvider(result.provider ?? provider);
          setType(result.type ?? type);
          setSchoolYear((result.schoolYear ?? schoolYear).toString());
          setCodePe(result.codePe ?? codePe);
        }
      );
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
            value={provider}
            onChange={handleChange(setProvider)}
            margin="dense"
            label="Fornecedor"
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
