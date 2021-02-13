import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '50vh',
  },
  progress: {
    margin: 'auto',
  },
});

export default function Loading() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress size={100} className={classes.progress} />
    </div>
  );
}
