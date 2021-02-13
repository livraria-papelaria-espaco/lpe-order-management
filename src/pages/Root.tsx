import { Container, CssBaseline, makeStyles } from '@material-ui/core';
import React, { ReactElement, useCallback, useState } from 'react';
import Sidebar from '../components/TopAppBar/Sidebar';
import TopAppBar from '../components/TopAppBar/TopAppBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

type Props = {
  children: ReactElement;
};

export default function App(props: Props) {
  const { children } = props;
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const toggleDrawerOpen = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopAppBar open={open} handleDrawerOpen={toggleDrawerOpen} />
      <Sidebar open={open} handleDrawerClose={toggleDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}
