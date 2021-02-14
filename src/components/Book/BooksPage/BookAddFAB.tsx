import React, { useCallback, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BookAddDialog from '../BookAddDialog';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function BookAddFAB() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <>
      <Fab
        variant="extended"
        color="secondary"
        className={classes.fab}
        onClick={toggle}
      >
        <AddIcon className={classes.extendedIcon} />
        Adicionar Livro
      </Fab>
      <BookAddDialog open={open} handleClose={toggle} />
    </>
  );
}
