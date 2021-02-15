import React, { useCallback, useState } from 'react';
import ImportFromSchool from './imports/ImportFromSchool';
import { Book } from '../../types/database';

interface BookWithQuantity extends Book {
  quantity: number;
}

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

  return (
    <div>
      <ImportFromSchool addBooks={addBooks} />
      <p>{JSON.stringify(books)}</p>
    </div>
  );
}
