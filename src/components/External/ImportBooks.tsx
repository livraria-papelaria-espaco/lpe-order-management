import {
  Button,
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
import React, { useCallback } from 'react';
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
    const success = await importBooksDistributor(products);
    if (!success) {
      enqueueSnackbar(`Ocorreu um erro ao importar livros da distribuidora`, {
        variant: 'error',
      });
      return;
    }

    enqueueSnackbar(`Livros importados com sucesso!`, { variant: 'success' });
    setProducts([]);
  };

  return (
    <div>
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
