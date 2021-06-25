import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import BackButton from '../components/BackButton';
import BookData from '../components/Book/BookPage/BookData';
import Loading from '../components/Loading';
import { BookPage } from '../types/database';

const { ipcRenderer } = require('electron');

type ParamType = {
  id: string | undefined;
};

export default function BookOnePage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<BookPage>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    ipcRenderer.send('db-book-find-one', id);
    ipcRenderer.once(
      'db-result-book-find-one',
      (_: never, response: BookPage | false) => {
        if (!response) {
          enqueueSnackbar('Livro não encontrado', { variant: 'error' });
          history.goBack();
          return;
        }
        setData(response);
      }
    );
  }, [enqueueSnackbar, history, id]);

  if (!data) return <Loading />;

  return (
    <div>
      <BackButton />
      <BookData book={data?.book} />
    </div>
  );
}
