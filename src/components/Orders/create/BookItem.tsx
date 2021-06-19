import {
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import MinusIcon from '@material-ui/icons/RemoveRounded';
import PlusIcon from '@material-ui/icons/AddRounded';
import { BookWithQuantity } from '../../../types/database';

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
    width: 50,
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

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h6">{book.name}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {[book.isbn, book.publisher].join(' | ')}
        </Typography>
      </div>
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
          type="number"
          variant="outlined"
          size="small"
          InputProps={{
            readOnly: true,
          }}
          value={book.quantity}
        />
        <IconButton
          size="small"
          className={classes.quantityButton}
          onClick={increase}
        >
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  );
}
