import { Button, makeStyles } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import BookData from '../components/Book/BookPage/BookData';
import Loading from '../components/Loading';
import { BookPage } from '../types/database';

const { ipcRenderer } = require('electron');

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginBottom: theme.spacing(2),
  },
}));

type ParamType = {
  id: string | undefined;
};

export default function BookOnePage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<BookPage>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

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
      <Button
        onClick={() => history.goBack()}
        startIcon={<BackIcon />}
        className={classes.backButton}
      >
        VOLTAR
      </Button>
      <BookData book={data?.book} />
    </div>
  );
}
