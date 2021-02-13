import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

type Props = {
  icon: React.ReactNode;
  text: string;
  to: string;
  // eslint-disable-next-line react/require-default-props
  exact?: boolean;
};

export default function LinkItem({ icon, text, to, exact = false }: Props) {
  const classes = useStyles();
  return (
    <ListItem
      component={NavLink}
      button
      to={to}
      activeClassName={classes.selected}
      exact={exact}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}
