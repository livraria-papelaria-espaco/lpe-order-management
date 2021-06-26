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
                <TableCell>Livro</TableCell>
                <TableCell>Qnt. Alvo</TableCell>
                <TableCell>Qnt. Encomendada</TableCell>
                <TableCell>Qnt. Disponível</TableCell>
                <TableCell>Qnt. Levantada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book: BookOrder) => (
                <TableRow hover key={book.id}>
                  <TableCell>
                    <Typography>{book.name}</Typography>
                    <Typography color="textSecondary">
                      {book.isbn}
                      {book.codePe && ` (${book.codePe})`}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.targetQuantity}</TableCell>
                  <TableCell>{book.orderedQuantity}</TableCell>
                  <TableCell>{book.availableQuantity}</TableCell>
                  <TableCell>{book.pickedupQuantity}</TableCell>
                </TableRow>
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
          <strong>Qnt. Encomenda: </strong>Quantidade que já foi encomendada à
          distribuidora e ainda não chegou.
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
