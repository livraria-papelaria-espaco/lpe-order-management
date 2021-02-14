import {
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditRounded';
import SaveIcon from '@material-ui/icons/SaveRounded';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Book } from '../../../types/database';
import BookDelete from './BookDelete';

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
  book: Book;
};

export default function BookData({ book }: Props) {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(book?.name);
  const [publisher, setPublisher] = useState(book?.publisher);
  const [provider, setProvider] = useState(book?.provider);
  const [type, setType] = useState<string>(book?.type);
  const [schoolYear, setSchoolYear] = useState(
    book?.schoolYear.toString(10) ?? ''
  );
  const [codePe, setCodePe] = useState(book?.codePe);
  const [stock, setStock] = useState(book?.stock.toString(10) ?? '');
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (fn: React.Dispatch<React.SetStateAction<string>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const toggleEdit = () => {
    if (!edit) {
      setEdit(true);
      return;
    }
    ipcRenderer.send('db-book-update', {
      isbn: book.isbn,
      name,
      publisher,
      provider,
      type,
      schoolYear,
      codePe,
      stock,
    });
    ipcRenderer.once('db-result-book-update', (_, success) => {
      if (success) {
        enqueueSnackbar('Alterações efetuadas com sucesso!', {
          variant: 'success',
        });
        return;
      }
      enqueueSnackbar('Ocorreu um erro desconhecido.', {
        variant: 'error',
      });
      setName(book?.name);
      setPublisher(book?.publisher);
      setProvider(book?.provider);
      setType(book?.type);
      setSchoolYear(book?.schoolYear.toString(10) ?? '');
      setCodePe(book?.codePe);
      setStock(book?.stock.toString(10) ?? '');
    });
    setEdit(false);
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.toolbar}>
        <div className={classes.title}>
          <Typography variant="h4">{book.isbn || 'Livro'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {`Adicionado em ${book.created_at.toLocaleString(
              'pt-PT'
            )} | Última atualização em ${book.updated_at.toLocaleString(
              'pt-PT'
            )}`}
          </Typography>
        </div>
        <div>
          <IconButton onClick={toggleEdit} color="secondary">
            {edit ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          <BookDelete id={book?.isbn} />
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
            label="Editora"
            value={publisher}
            onChange={handleChange(setPublisher)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fornecedor"
            value={provider}
            onChange={handleChange(setProvider)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tipo"
            select
            value={type}
            onChange={handleChange(setType)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          >
            <MenuItem value="manual">Manual</MenuItem>
            <MenuItem value="ca">Caderno de Atividades</MenuItem>
            <MenuItem value="other">Não Escolar</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Ano Escolar"
            value={schoolYear}
            type="number"
            onChange={handleChange(setSchoolYear)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Código Porto Editora"
            value={codePe}
            onChange={handleChange(setCodePe)}
            InputProps={{
              readOnly: !edit,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Stock Disponível para Venda"
            value={stock}
            type="number"
            onChange={handleChange(setStock)}
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
