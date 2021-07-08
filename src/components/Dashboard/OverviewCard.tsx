import { darken, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

interface Props {
  color: string;
  title: string;
  value: string | number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    color: 'white',
    backgroundColor: ({ color }: { color: string }) => darken(color, 0.15),
  },
}));

export default function OverviewCard({ color, title, value }: Props) {
  const classes = useStyles({ color });

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}
