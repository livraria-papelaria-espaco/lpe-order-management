import React, { useCallback, useState, useMemo } from 'react';

import { Book, BookWithQuantity, Customer } from '../../types/database';
import BookList from './create/BookList';
import CreateOrder from './create/CreateOrder';
import CustomerSelector from './create/CustomerSelector';
import ImportFromSchool from './imports/ImportFromSchool';
import OrderNotes from './create/OrderNotes';

export default function NewOrder() {
  const [books, setBooks] = useState<BookWithQuantity[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<string>('');

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
      <CustomerSelector customer={customer} setCustomer={setCustomer} />
      <OrderNotes value={notes} setValue={setNotes} />
      <CreateOrder books={bookRecord} customer={customer} notes={notes} />
    </div>
  );
}
