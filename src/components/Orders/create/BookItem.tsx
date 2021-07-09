import {
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import MinusIcon from '@material-ui/icons/RemoveRounded';
import PlusIcon from '@material-ui/icons/AddRounded';
import { BookWithQuantity } from '../../../types/database';
import BookTypeChip from '../../Book/BookTypeChip';

type Props = {
  book: BookWithQuantity;
  updateQuantity: (isbn: string, quantity: number) => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
  },
  quantityInput: {
    width: 75,
  },
  quantityButton: {
    margin: theme.spacing(1),
  },
}));

export default function BookItem({ book, updateQuantity }: Props) {
  const classes = useStyles();

  const increase = () => updateQuantity(book.isbn, book.quantity + 1);
  const decrease = () =>
    book.quantity > 0 && updateQuantity(book.isbn, book.quantity - 1);
  const change = (event: React.FocusEvent<HTMLInputElement>) => {
    const qnt = Math.max(parseInt(event.target.value, 10), 0);
    updateQuantity(book.isbn, Number.isNaN(qnt) ? 0 : qnt);
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography>{book.name}</Typography>
        <Typography color="textSecondary">
          {book.isbn}
          {book.codePe && ` (${book.codePe})`}
          {` | ${book.publisher}`}
        </Typography>
      </TableCell>
      <TableCell>
        <BookTypeChip type={book.type} />
      </TableCell>
      <TableCell>
        <div className={classes.quantitySection}>
          <IconButton
            size="small"
            className={classes.quantityButton}
            onClick={decrease}
          >
            <MinusIcon />
          </IconButton>
          <TextField
            className={classes.quantityInput}
            variant="outlined"
            size="small"
            value={book.quantity}
            onChange={change}
          />
          <IconButton
            size="small"
            className={classes.quantityButton}
            onClick={increase}
          >
            <PlusIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}
