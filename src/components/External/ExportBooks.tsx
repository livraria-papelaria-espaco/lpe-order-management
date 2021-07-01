import {
  Button,
  Checkbox,
  Divider,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/GetAppRounded';
import MarkOrderedIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { BookWithQuantity } from '../../types/database';
import BookTypeChip from '../Book/BookTypeChip';

const { ipcRenderer } = require('electron');

interface Props {
  products: BookWithQuantity[];
  refreshProducts(): void;
}

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2),
  },
  buttonSection: {
    marginTop: theme.spacing(2),
  },
  buttonMargin: {
    marginLeft: theme.spacing(2),
  },
}));

export default function ExportBooks({ products, refreshProducts }: Props) {
  const [selection, setSelection] = useState<string[]>([]);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Make all products selected by default

    const newSelection = products.map((n) => n.isbn);
    setSelection(newSelection);
  }, [products]);

  if (products.length === 0)
    return <Alert severity="info">Não existem produtos por encomendar</Alert>;

  const handleMarkOrdered = () => {
    ipcRenderer.once(
      'db-distributor-export-books-result',
      (_: unknown, successCount: number) => {
        if (successCount === 1)
          enqueueSnackbar('1 livro foi marcado como encomendado com sucesso!', {
            variant: 'success',
          });
        else if (successCount > 1)
          enqueueSnackbar(
            `${successCount} foram marcados como encomendados com sucesso!`,
            { variant: 'success' }
          );
        else {
          enqueueSnackbar(`Erro ao marcar livros como encomendados`, {
            variant: 'error',
          });
          return;
        }
        setSelection([]);
        refreshProducts();
      }
    );

    ipcRenderer.send('db-distributor-export-books', selection);
  };

  const handleCustomExcelDownload = (distributor: string) => () => {
    ipcRenderer.once(
      'save-custom-distributor-excel-result',
      (_: unknown, success: boolean) => {
        if (success)
          enqueueSnackbar('Lista de livros exportada com sucesso!', {
            variant: 'success',
          });
        else
          enqueueSnackbar('Exportação de lista de livros cancelada', {
            variant: 'error',
          });
      }
    );

    ipcRenderer.send(
      'save-custom-distributor-excel',
      distributor,
      products.filter((product) => selection.indexOf(product.isbn) >= 0)
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelection = products.map((n) => n.isbn);
      setSelection(newSelection);
      return;
    }
    setSelection([]);
  };

  const handleClick = (key: string) => {
    const selectionIndex = selection.indexOf(key);
    let newSelection: string[];

    if (selectionIndex < 0) {
      newSelection = [...selection, key];
    } else {
      newSelection = [...selection];
      newSelection.splice(selectionIndex, 1);
    }

    setSelection(newSelection);
  };

  const numSelected = selection.length;
  const rowCount = products.length;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="export products table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all products' }}
                />
              </TableCell>
              <TableCell>Livro</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.isbn}
                onClick={() => handleClick(product.isbn)}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selection.indexOf(product.isbn) >= 0} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell>
                  <BookTypeChip type={product.type} />
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider variant="middle" className={classes.divider} />
      <Typography variant="h6" gutterBottom>
        Produtos Exportados
      </Typography>
      <TextField
        multiline
        label="Lista Exportada"
        value={products
          .filter((product) => selection.indexOf(product.isbn) >= 0)
          .map((product) => `${product.isbn} x${product.quantity}`)
          .join('\n')}
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
        fullWidth
      />
      <div className={classes.buttonSection}>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<MarkOrderedIcon />}
          disabled={selection.length === 0}
          onClick={handleMarkOrdered}
        >
          Marcar como encomendados
        </Button>
        <Button
          className={classes.buttonMargin}
          variant="outlined"
          startIcon={<DownloadIcon />}
          disabled={selection.length === 0}
          onClick={handleCustomExcelDownload('porto-editora')}
        >
          Obter Excel Porto Editora
        </Button>
      </div>
    </div>
  );
}
