import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

// const { app } = require('electron').remote;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

export default function VersionIndicator() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="body2" color="textSecondary">
        {`Versão ${/* app.getVersion() */ 'todo'}`}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Designed by Diogo Correia
      </Typography>
    </div>
  );
}
