import {
  Card,
  CardContent,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { BookWithQuantity } from '../../../types/database';
import { fetchBookMetadata, insertOrGetBooks } from '../../../utils/api';
import BookQuantityInput from '../../Book/BookQuantityInput';
import BookItem from './BookItem';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

type Props = {
  books: BookWithQuantity[];
  updateQuantity: (isbn: string, quantity: number) => void;
  addBooks: (books: BookWithQuantity[]) => void;
};

export default function BookList({ books, updateQuantity, addBooks }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const addBook = async (book: BookWithQuantity) => {
    if (book.schoolYear === -1) {
      // book does not exist, fetch book
      addBooks([{ ...book, quantity: 0 }]);

      const bookMetadata = await fetchBookMetadata(book.isbn);
      let newBook;
      if (!bookMetadata) {
        enqueueSnackbar(`Erro ao obter informação sobre o livro ${book.isbn}`, {
          variant: 'error',
        });
        newBook = { ...book, schoolYear: 0 };
      } else {
        newBook = { ...bookMetadata, isbn: book.isbn };
      }

      const [formattedBook] = await insertOrGetBooks([newBook]);

      if (formattedBook) {
        addBooks([{ ...formattedBook, quantity: book.quantity }]);
      }

      return;
    }
    addBooks([book]);
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">Lista de Livros</Typography>
        <Table aria-label="export products table">
          <TableHead>
            <TableRow>
              <TableCell>ISBN/Código PE</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <BookItem
                key={book.isbn}
                book={book}
                updateQuantity={updateQuantity}
              />
            ))}
            {books.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography color="textSecondary">
                    Adicione livros para criar uma encomenda
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            <BookQuantityInput addBook={addBook} acceptUnknownBooks />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
