import {
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditRounded';
import SaveIcon from '@material-ui/icons/SaveRounded';
import DownloadIcon from '@material-ui/icons/CloudDownloadRounded';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Book, BookQueryResult } from '../../../types/database';
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
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(book?.name);
  const [publisher, setPublisher] = useState(book?.publisher);
  const [provider, setProvider] = useState(book?.provider);
  const [type, setType] = useState(book?.type);
  const [schoolYear, setSchoolYear] = useState(
    book?.schoolYear.toString(10) ?? ''
  );
  const [codePe, setCodePe] = useState(book?.codePe);
  const [stock, setStock] = useState(book?.stock.toString(10) ?? '');
  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (fn: React.Dispatch<React.SetStateAction<any>>) => (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => fn(evt.target.value);

  const saveChanges = (data: Book) => {
    ipcRenderer.once('db-result-book-update', (_: never, success: boolean) => {
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
    ipcRenderer.send('db-book-update', data);
  };

  const toggleEdit = () => {
    if (!edit) {
      setEdit(true);
      return;
    }
    saveChanges({
      isbn: book.isbn,
      name,
      publisher,
      provider,
      type,
      schoolYear: parseInt(schoolYear, 10),
      codePe,
      stock: parseInt(stock, 10),
    });
    setEdit(false);
  };

  const fetchMetadata = () => {
    setLoading(true);
    ipcRenderer.send('utils-book-get-metadata', book.isbn);
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
        setName(result.name ?? name);
        setPublisher(result.publisher ?? publisher);
        setProvider(result.provider ?? provider);
        setType(result.type ?? type);
        setSchoolYear((result.schoolYear ?? schoolYear).toString());
        setCodePe(result.codePe ?? codePe);
        saveChanges({
          isbn: book.isbn,
          name: result.name ?? name,
          publisher: result.publisher ?? publisher,
          provider: result.provider ?? provider,
          type: result.type ?? type,
          schoolYear: result.schoolYear ?? schoolYear,
          codePe: result.codePe ?? codePe,
          stock: parseInt(stock, 10),
        });
      }
    );
  };

  return (
    <Paper className={classes.paper}>
      {loading && <LinearProgress />}
      <div className={classes.toolbar}>
        <div className={classes.title}>
          <Typography variant="h4">{book.isbn || 'Livro'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {`Adicionado em ${book.created_at?.toLocaleString(
              'pt-PT'
            )} | Última atualização em ${book.updated_at?.toLocaleString(
              'pt-PT'
            )}`}
          </Typography>
        </div>
        <div>
          <IconButton onClick={fetchMetadata}>
            <DownloadIcon />
          </IconButton>
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
