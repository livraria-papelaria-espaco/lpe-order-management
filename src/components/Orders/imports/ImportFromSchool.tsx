import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import wookLogo from '../../../assets/wook.png';
import { Book } from '../../../types/database';
import {
  importFromWook,
  insertOrGetBooks,
  parseImportFromWook,
} from '../../../utils/api';

type Props = {
  addBooks: (books: Book[]) => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  cardContent: {
    textAlign: 'center',
  },
  cardImage: {
    maxHeight: 85,
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
}));

export default function ImportFromSchool({ addBooks }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const openWook = async () => {
    setOpen(true);
    const wookIds = await importFromWook();
    setOpen(false);

    if (!wookIds) {
      enqueueSnackbar(`Operação cancelada.`, { variant: 'error' });
      return;
    }

    setLoading(true);
    const bookData = await parseImportFromWook(wookIds);
    const insertedBookData = await insertOrGetBooks(bookData);

    setLoading(false);
    if (!insertedBookData) {
      enqueueSnackbar('Ocorreu um erro a guardar os livros', {
        variant: 'error',
      });
      return;
    }

    addBooks(insertedBookData);

    if (wookIds.length > insertedBookData.length)
      enqueueSnackbar(
        `Não foi possível importar ${
          wookIds.length - insertedBookData.length
        } livro(s)`,
        { variant: 'warning' }
      );
  };

  /* TODO Disable navigation and screen interaction while Wook is open */

  return (
    <div className={classes.root}>
      <Card className={classes.cardContent}>
        <CardActionArea disabled={open || loading} onClick={openWook}>
          <img className={classes.cardImage} src={wookLogo} alt="Wook" />
          <CardContent>
            <Typography variant="h5">Importar por ano e escola</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {loading && <CircularProgress size={80} className={classes.progress} />}
    </div>
  );
}
