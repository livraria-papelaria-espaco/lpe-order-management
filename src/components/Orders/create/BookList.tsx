import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { BookWithQuantity } from '../../../types/database';
import BookItem from './BookItem';

type Props = {
  books: BookWithQuantity[];
  updateQuantity: (isbn: string, quantity: number) => void;
};

export default function BookList({ books, updateQuantity }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Lista de Livros</Typography>
        {books.map((book) => (
          <BookItem
            key={book.isbn}
            book={book}
            updateQuantity={updateQuantity}
          />
        ))}
      </CardContent>
    </Card>
  );
}
