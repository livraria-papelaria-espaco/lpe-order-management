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

const { ipcRenderer } = require('electron');

type Props = {
  addBooks: (books: Array<Book>) => void;
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
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const openWook = () => {
    ipcRenderer.send('order-import-wook-open');

    ipcRenderer.once('order-import-wook-result', (_, result: string[]) => {
      if (result) {
        setLoading(true);
        ipcRenderer.send('order-import-wook-parse', result);

        ipcRenderer.once(
          'order-import-wook-parse-result',
          (__, parseResult: Book[]) => {
            setLoading(false);
            parseResult.forEach((book) =>
              ipcRenderer.send('db-books-insert', book)
            );
            addBooks(parseResult);
          }
        );
        return;
      }
      enqueueSnackbar(`Operação cancelada.`, { variant: 'error' });
    });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.cardContent}>
        <CardActionArea disabled={loading} onClick={openWook}>
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
