import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { BookWithQuantity } from '../../../types/database';
import BookItem from './BookItem';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

type Props = {
  books: BookWithQuantity[];
  updateQuantity: (isbn: string, quantity: number) => void;
};

export default function BookList({ books, updateQuantity }: Props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">Lista de Livros</Typography>
        {books.map((book) => (
          <BookItem
            key={book.isbn}
            book={book}
            updateQuantity={updateQuantity}
          />
        ))}
        {books.length === 0 && (
          <Typography color="textSecondary">
            Adicione livros para criar uma encomenda
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
