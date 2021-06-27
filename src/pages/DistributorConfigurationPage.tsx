import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import DistributorList from '../components/External/DistributorList';
import Loading from '../components/Loading';

const { ipcRenderer } = require('electron');

export default function DistributorConfigurationPage() {
  const [distributorMap, setDistributorMap] = useState<Record<
    string,
    string | null
  > | null>(null);

  useEffect(() => {
    ipcRenderer.once(
      'db-find-publisher-distributor-map-result',
      (_: unknown, result: Record<string, string>) => {
        setDistributorMap(result);
      }
    );

    ipcRenderer.send('db-find-publisher-distributor-map');
  }, [setDistributorMap]);

  const { enqueueSnackbar } = useSnackbar();

  const update = (publisher: string, distributor: string | null) => {
    ipcRenderer.once(
      'db-update-publisher-distributor-map-result',
      (_: unknown, success: boolean) => {
        if (success) {
          setDistributorMap((map) => ({ ...map, [publisher]: distributor }));
          enqueueSnackbar('Alterações gravadas!', { variant: 'success' });
        } else {
          enqueueSnackbar('Erro ao guardar alterações!', { variant: 'error' });
        }
      }
    );

    ipcRenderer.send(
      'db-update-publisher-distributor-map',
      publisher,
      distributor
    );
  };

  if (distributorMap === null) return <Loading />;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Configuração Distribuidoras
      </Typography>
      <DistributorList distributorMap={distributorMap} update={update} />
    </div>
  );
}
