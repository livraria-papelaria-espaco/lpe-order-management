import {
  Button,
  Divider,
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
import MarkArrivedIcon from '@material-ui/icons/PlaceRounded';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';
import { BookWithQuantity } from '../../types/database';
import BookQuantityInput from '../Book/BookQuantityInput';
import BookTypeChip from '../Book/BookTypeChip';

interface Props {
  products: BookWithQuantity[];
  setProducts: React.Dispatch<React.SetStateAction<BookWithQuantity[]>>;
}

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2),
  },
  buttonSection: {
    marginTop: theme.spacing(2),
  },
  buttonMargin: {
    marginLeft: theme.spacing(2),
  },
}));

export default function ImportBooks({ products, setProducts }: Props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const addBook = useCallback(
    (book: BookWithQuantity) => {
      setProducts((books) => {
        if (books.findIndex((v) => v.isbn === book.isbn) >= 0) {
          enqueueSnackbar(
            `Esse livro já está na lista, não foi feita nenhuma alteração`,
            { variant: 'warning' }
          );
          return books;
        }
        return [...books, book];
      });
    },
    [enqueueSnackbar, setProducts]
  );

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="export products table">
          <TableHead>
            <TableRow>
              <TableCell>ISBN/Código PE</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.isbn}>
                <TableCell component="th" scope="row">
                  <Typography>{product.name}</Typography>
                  <Typography color="textSecondary">
                    {product.isbn}
                    {product.codePe && ` (${product.codePe})`}
                    {` | ${product.publisher}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <BookTypeChip type={product.type} />
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
            <BookQuantityInput addBook={addBook} />
          </TableBody>
        </Table>
      </TableContainer>
      <Divider variant="middle" className={classes.divider} />
      <div className={classes.buttonSection}>
        <Button
          color="secondary"
          variant="contained"
          startIcon={<MarkArrivedIcon />}
          disabled={products.length === 0}
          // onClick={handleMarkArrived}
        >
          Marcar como recebido
        </Button>
      </div>
    </div>
  );
}
