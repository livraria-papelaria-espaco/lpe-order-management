import React, { useCallback, useState, useMemo } from 'react';

import { Book, BookWithQuantity } from '../../types/database';
import BookList from './create/BookList';
import CreateOrder from './create/CreateOrder';
import ImportFromSchool from './imports/ImportFromSchool';

export default function NewOrder() {
  const [books, setBooks] = useState<BookWithQuantity[]>([]);

  const addBooks = useCallback(
    (newBooks: Book[]) => {
      const updatedBooks: BookWithQuantity[] = [...books];
      newBooks.forEach((book) => {
        const sameBook = updatedBooks.find((v) => v.isbn === book.isbn);
        if (sameBook) {
          sameBook.quantity += 1;
        } else {
          updatedBooks.push({ ...book, quantity: 1 });
        }
      });
      setBooks(updatedBooks);
    },
    [books]
  );

  const updateQuantity = useCallback(
    (isbn: string, quantity: number) =>
      setBooks(
        books.map((book) => (book.isbn === isbn ? { ...book, quantity } : book))
      ),
    [books]
  );

  const bookRecord = useMemo(
    () =>
      books.reduce(
        (acc, v) => (v.quantity === 0 ? acc : { ...acc, [v.isbn]: v.quantity }),
        {}
      ),
    [books]
  );

  return (
    <div>
      <ImportFromSchool addBooks={addBooks} />
      <BookList books={books} updateQuantity={updateQuantity} />
      <CreateOrder books={bookRecord} />
    </div>
  );
}
