import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import MarkArrivedIcon from '@material-ui/icons/PlaceRounded';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { BookWithQuantity } from '../../types/database';
import { importBooksDistributor } from '../../utils/api';
import BookQuantityInput from '../Book/BookQuantityInput';
import BookItem from '../Orders/create/BookItem';

interface Props {
  products: BookWithQuantity[];
  setProducts: React.Dispatch<React.SetStateAction<BookWithQuantity[]>>;
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

export default function ImportBooks({ products, setProducts }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [importOverflow, setImportOverflow] = useState<
    BookWithQuantity[] | null
  >(null);

  const handleCloseDialog = () => setImportOverflow(null);

  const addBook = useCallback(
    (book: BookWithQuantity) => {
      setProducts((books) => {
        if (books.findIndex((v) => v.isbn === book.isbn) >= 0) {
          enqueueSnackbar(
            `Esse livro já está na lista, não foi feita nenhuma alteração`,
            { variant: 'warning' }
          );
          return books;
        }
        return [...books, book];
      });
    },
    [enqueueSnackbar, setProducts]
  );

  const updateQuantity = useCallback(
    (isbn: string, quantity: number) => {
      setProducts((books) =>
        books.map((book) => (book.isbn === isbn ? { ...book, quantity } : book))
      );
    },
    [setProducts]
  );

  const handleMarkArrived = async () => {
    const overflow = await importBooksDistributor(products);
    if (!overflow) {
      enqueueSnackbar(`Ocorreu um erro ao importar livros da distribuidora`, {
        variant: 'error',
      });
      return;
    }

    const overflowBooks = Object.entries(overflow).map(([isbn, qnt]) => ({
      ...products.find((product) => product.isbn === isbn),
      quantity: qnt,
    }));

    enqueueSnackbar(`Livros importados com sucesso!`, { variant: 'success' });
    setProducts([]);
    setImportOverflow(
      overflowBooks.length === 0 ? null : (overflowBooks as BookWithQuantity[])
    );
  };

  return (
    <div>
      <Dialog open={!!importOverflow}>
        <DialogTitle>Produtos em Excesso</DialogTitle>
        <DialogContent>
          Os seguintes produtos não são necessários para nenhuma encomenda e
          estão em excesso:
          <ul>
            {importOverflow &&
              importOverflow.map(({ isbn, name, quantity }) => (
                <li key={isbn}>
                  {name} - {isbn} x{quantity}
                </li>
              ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table aria-label="export products table">
          <TableHead>
            <TableRow>
              <TableCell>ISBN/Código PE</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <BookItem
                key={product.isbn}
                book={product}
                updateQuantity={updateQuantity}
              />
            ))}
            <BookQuantityInput addBook={addBook} />
          </TableBody>
        </Table>
      </TableContainer>
      <Divider variant="middle" className={classes.divider} />
      <div className={classes.buttonSection}>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<MarkArrivedIcon />}
          disabled={products.length === 0}
          onClick={handleMarkArrived}
        >
          Marcar como recebido
        </Button>
      </div>
    </div>
  );
}
