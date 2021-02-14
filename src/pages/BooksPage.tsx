import React from 'react';
import BookAddFAB from '../components/Book/BooksPage/BookAddFAB';
import BookList from '../components/Book/BookList';

export default function BooksPage() {
  return (
    <div>
      <BookList />
      <BookAddFAB />
    </div>
  );
}
