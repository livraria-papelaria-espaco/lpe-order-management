import { Button, makeStyles } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import React from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginBottom: theme.spacing(2),
  },
}));

const BackButton = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Button
      onClick={() => history.goBack()}
      startIcon={<BackIcon />}
      className={classes.backButton}
    >
      VOLTAR
    </Button>
  );
};

export default BackButton;
