import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import React, { useState } from 'react';
import { BookOrder } from '../../../types/database';
import BookOrderHistoryItem from './BookOrderHistoryItem';

const useStyles = makeStyles((theme) => ({
  collapsibleCell: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  box: {
    paddingLeft: theme.spacing(9),
  },
  historyItems: {
    paddingLeft: theme.spacing(1),
  },
}));

interface Props {
  book: BookOrder;
}

export default function OrderBookList({ book }: Props) {
  const classes = useStyles();
  const [open, setOpen] = useState(!!book.history?.length);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{book.name}</Typography>
          <Typography color="textSecondary">
            {book.isbn}
            {book.codePe && ` (${book.codePe})`}
            {` | ${book.publisher}`}
          </Typography>
        </TableCell>
        <TableCell>{book.targetQuantity}</TableCell>
        <TableCell>{book.targetQuantity - book.orderedQuantity}</TableCell>
        <TableCell>{book.availableQuantity}</TableCell>
        <TableCell>{book.pickedupQuantity}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.collapsibleCell} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.box}>
              <Typography variant="h6" gutterBottom component="div">
                Histórico
              </Typography>
              <div className={classes.historyItems}>
                {book.history?.map((history) => (
                  <BookOrderHistoryItem history={history} key={history.id} />
                ))}
              </div>
              {!book.history?.length && (
                <Typography color="textSecondary">
                  Não existe histórico para este item.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
