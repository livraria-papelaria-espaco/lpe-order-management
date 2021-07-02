import { TableCell, TableRow, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useRef } from 'react';

import { Book, BookWithQuantity } from '../../types/database';
import { findAllBooks } from '../../utils/api';

interface Props {
  addBook: (book: BookWithQuantity) => void;
}

export default function BookQuantityInput({ addBook }: Props) {
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
    <TableRow>
      <TableCell colSpan={2}>
        <Autocomplete
          value={value}
          onChange={(_event: unknown, newValue: Book | null) => {
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
