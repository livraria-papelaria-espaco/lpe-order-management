import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import 'typeface-roboto/index.css';
import Routes from '../Routes';
import { Store } from '../store';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <SnackbarProvider autoHideDuration={8000}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </SnackbarProvider>
  </Provider>
);

export default hot(Root);
