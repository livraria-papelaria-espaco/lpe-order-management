import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import SeeIcon from '@material-ui/icons/VisibilityRounded';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import routes from '../../constants/routes';
import { Book } from '../../types/database';
import { findAllBooks } from '../../utils/api';
import BookTypeChip from './BookTypeChip';

const { ipcRenderer } = require('electron');

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const history = useHistory();

  const refreshView = useCallback(async () => {
    const bookList = await findAllBooks();
    setBooks([...bookList]);
  }, []);
  const handleEventRefresh = useCallback(
    (_, sucess) => sucess && refreshView(),
    [refreshView]
  );

  useEffect(() => {
    refreshView();

    ipcRenderer.on('db-result-books-insert', handleEventRefresh);

    return () => {
      ipcRenderer.removeListener('db-result-books-insert', handleEventRefresh);
    };
  }, [handleEventRefresh, refreshView]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="book table">
          <TableHead>
            <TableRow>
              <TableCell>ISBN</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Editora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell padding="checkbox" align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book: Book) => (
              <TableRow
                hover
                onClick={() => {
                  history.push(routes.BOOK.replace(':id', `${book.isbn}`));
                }}
                key={book.isbn}
              >
                <TableCell component="th" scope="row">
                  {book.isbn}
                </TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>
                  <BookTypeChip type={book.type} />
                </TableCell>
                <TableCell padding="checkbox" align="right">
                  <Button startIcon={<SeeIcon />} color="primary">
                    Ver&nbsp;&amp;&nbsp;Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
