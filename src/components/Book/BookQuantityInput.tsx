import { TableCell, TableRow, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useRef } from 'react';

import { Book, BookWithQuantity } from '../../types/database';
import { findAllBooks } from '../../utils/api';
import { isISBN } from '../../utils/books';

interface Props {
  addBook: (book: BookWithQuantity) => void;
  acceptUnknownBooks?: boolean;
}

export default function BookQuantityInput({
  addBook,
  acceptUnknownBooks,
}: Props) {
  const [options, setOptions] = useState<Book[]>([]);
  const [value, setValue] = useState<Book | null>(null);
  const bookRef = useRef<HTMLInputElement>(null);
  const qntRef = useRef<HTMLInputElement>(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    findAllBooks()
      .then(setOptions)
      .catch(() => {
        enqueueSnackbar(`Erro ao obter lista de livros`, { variant: 'error' });
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (value !== null) {
      qntRef.current?.focus();
    }
  }, [addBook, value]);

  const handleQntBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (value !== null) {
      const quantity = parseInt(event.target.value, 10) || 1;
      addBook({ ...value, quantity });
      event.target.value = '';
      setValue(null);

      // changing focus right away does not work
      setTimeout(() => bookRef.current?.focus(), 100);
    }
  };

  return (
    <TableRow style={{ verticalAlign: 'top' }}>
      <TableCell colSpan={2}>
        <Autocomplete
          value={value}
          freeSolo={acceptUnknownBooks}
          clearOnBlur={acceptUnknownBooks}
          onChange={(_event: unknown, newValue: Book | string | null) => {
            if (typeof newValue === 'string') {
              if (isISBN(newValue)) {
                setValue({
                  isbn: newValue,
                  name: 'Sem Informação',
                  publisher: '',
                  type: 'other',
                  codePe: '',
                  schoolYear: -1,
                  stock: 0,
                });
              } else {
                enqueueSnackbar(`${newValue} não é um ISBN válido`, {
                  variant: 'error',
                });
              }
              return;
            }
            setValue(newValue);
          }}
          autoHighlight
          options={options}
          getOptionLabel={(option) =>
            `${option.isbn}${option.codePe && ` (${option.codePe})`} - ${
              option.name
            }`
          }
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              inputRef={bookRef}
              label="Nome / ISBN / Código PE"
              variant="outlined"
              helperText={
                acceptUnknownBooks
                  ? `Para adicionar um livro que não existe, escrever o ISBN e clicar no <ENTER>`
                  : ''
              }
            />
          )}
        />
      </TableCell>
      <TableCell>
        <TextField
          inputRef={qntRef}
          label="Qnt"
          variant="outlined"
          onBlur={handleQntBlur}
          fullWidth
        />
      </TableCell>
    </TableRow>
  );
}

BookQuantityInput.defaultProps = {
  acceptUnknownBooks: false,
};
