import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { BookOrder } from '../../../types/database';
import BookListRow from './BookListRow';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
  },
}));

interface Props {
  books: BookOrder[];
}

export default function OrderBookList({ books }: Props) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.card}>
        <TableContainer component={Paper}>
          <Table aria-label="order table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Livro</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Qnt. Alvo</TableCell>
                <TableCell>Qnt. Por Encomendar</TableCell>
                <TableCell>Qnt. Disponível</TableCell>
                <TableCell>Qnt. Levantada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book: BookOrder) => (
                <BookListRow book={book} key={book.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={classes.card}>
        <Typography>
          <strong>Qnt. Alvo: </strong>Quantidade que o cliente encomendou.
        </Typography>
        <Typography>
          <strong>Qnt. Por Encomendar: </strong>Quantidade que falta encomendar
          à distribuidora.
        </Typography>
        <Typography>
          <strong>Qnt. Disponível: </strong>Quantidade disponível para
          levantamento.
        </Typography>
        <Typography>
          <strong>Qnt. Levantada: </strong>Quantidade já levantada pelo cliente.
        </Typography>
      </div>
    </div>
  );
}
