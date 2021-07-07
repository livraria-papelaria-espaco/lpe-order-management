import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useState, useEffect, useMemo } from 'react';
import IncreaseIcon from '@material-ui/icons/AddRounded';
import DecreaseIcon from '@material-ui/icons/RemoveRounded';
import { useSnackbar } from 'notistack';
import { Order } from '../../../types/database';
import { pickupProducts } from '../../../utils/api';

interface Props {
  order: Order;
  open: boolean;
  handleToggle(): void;
  updateHook(): void;
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  quantityControls: {
    marginLeft: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
  },
  quantityText: {
    textAlign: 'center',
  },
}));

export default function PickupBooksDialog({
  order,
  open,
  handleToggle,
  updateHook,
}: Props) {
  const classes = useStyles();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { enqueueSnackbar } = useSnackbar();

  const increaseQuantity = (isbn: string) => () => {
    const currentQuantity = quantities[isbn] || 0;
    const book = order.books?.find((b) => b.isbn === isbn);
    const maxQuantity =
      (book?.availableQuantity ?? 0) - (book?.pickedupQuantity ?? 0) || 0;
    if (currentQuantity < maxQuantity)
      setQuantities({ ...quantities, [isbn]: currentQuantity + 1 });
  };

  const decreaseQuantity = (isbn: string) => () => {
    const currentQuantity = quantities[isbn] || 0;
    if (currentQuantity > 0)
      setQuantities({ ...quantities, [isbn]: currentQuantity - 1 });
  };

  const booksToPickup = useMemo(
    () =>
      order.books?.filter(
        (book) => book.availableQuantity > book.pickedupQuantity
      ) ?? [],
    [order.books]
  );

  useEffect(() => {
    setQuantities(
      booksToPickup.reduce(
        (acc, book) => ({
          ...acc,
          [book.isbn]: book.availableQuantity - book.pickedupQuantity,
        }),
        {}
      )
    );
  }, [booksToPickup]);

  const handleSubmit = async () => {
    const success = await pickupProducts(order.id, quantities);
    if (success) {
      enqueueSnackbar('Livros marcados como levantados!', {
        variant: 'success',
      });
      updateHook();
    } else {
      enqueueSnackbar('Ocorreu um erro a marcar os livros como levantados', {
        variant: 'error',
      });
    }
    // Close dialog
    handleToggle();
  };

  return (
    <Dialog onClose={handleToggle} open={open} maxWidth="md">
      <DialogTitle>Levantamento de Produtos</DialogTitle>
      <DialogContent>
        {booksToPickup.length === 0 && (
          <Typography color="textSecondary">
            Não existem livros por levantar
          </Typography>
        )}
        {booksToPickup.map((book) => (
          <div key={book.isbn} className={classes.listItem}>
            <div>
              <Typography>{book.name}</Typography>
              <Typography color="textSecondary">
                {book.isbn} | {book.publisher}
              </Typography>
            </div>
            <div className={classes.quantityControls}>
              <IconButton
                onClick={decreaseQuantity(book.isbn)}
                disabled={(quantities[book.isbn] || 0) === 0}
              >
                <DecreaseIcon />
              </IconButton>
              <div className={classes.quantityText}>
                <Typography>{quantities[book.isbn] || 0}</Typography>
                <Typography color="textSecondary" variant="caption" noWrap>
                  Max. {book.availableQuantity - book.pickedupQuantity}
                </Typography>
              </div>
              <IconButton
                onClick={increaseQuantity(book.isbn)}
                disabled={
                  (quantities[book.isbn] || 0) ===
                  book.availableQuantity - book.pickedupQuantity
                }
              >
                <IncreaseIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleToggle} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Levantar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
