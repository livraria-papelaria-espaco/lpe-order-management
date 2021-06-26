import {
  Card,
  CardContent,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useCallback } from 'react';

interface Props {
  value: string;
  setValue(value: string): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  input: {
    marginTop: theme.spacing(2),
  },
}));

export default function OrderNotes({ value, setValue }: Props) {
  const classes = useStyles();

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5">Observações</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Vouchers Mega, Sinal, etc
        </Typography>
        <TextField
          className={classes.input}
          value={value}
          onChange={handleChange}
          multiline
          variant="outlined"
          fullWidth
        />
      </CardContent>
    </Card>
  );
}
