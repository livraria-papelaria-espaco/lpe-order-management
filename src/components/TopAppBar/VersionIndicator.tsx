import { makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const { ipcRenderer } = require('electron');

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

export default function VersionIndicator() {
  const classes = useStyles();
  const [version, setVersion] = useState('');

  useEffect(() => {
    ipcRenderer.once('meta-app-version-result', (_: never, vers: string) => {
      setVersion(vers);
    });
    ipcRenderer.send('meta-app-version');
  }, [setVersion]);

  return (
    <div className={classes.root}>
      <Typography variant="body2" color="textSecondary">
        {`Versão v${version}`}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Designed by Diogo Correia
      </Typography>
    </div>
  );
}
