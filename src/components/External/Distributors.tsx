import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRightRounded';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));

interface Props {
  distributors: string[];
  nextRoute: string;
}

export default function Distributors({ distributors, nextRoute }: Props) {
  const classes = useStyles();
  const history = useHistory();

  if (distributors.length === 0)
    return (
      <Alert className={classes.root} severity="info">
        Não foram encontradas distribuidoras
      </Alert>
    );

  return (
    <Paper>
      <List>
        {distributors.map((distributor) => (
          <ListItem
            key={distributor}
            button
            onClick={() =>
              history.push(
                nextRoute.replace(':name', encodeURIComponent(distributor))
              )
            }
          >
            <ListItemText>{distributor}</ListItemText>
            <ListItemIcon>
              <ChevronRightIcon />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
