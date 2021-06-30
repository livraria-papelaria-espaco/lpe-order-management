import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Distributors from '../components/External/Distributors';
import Loading from '../components/Loading';

const { ipcRenderer } = require('electron');

interface Props {
  title: string;
  nextRoute: string;
}

export default function DistributorExport({ title, nextRoute }: Props) {
  const [distributors, setDistributors] = useState<string[]>([]);

  useEffect(() => {
    ipcRenderer.once(
      'db-find-distributors-result',
      (_: unknown, result: string[]) => {
        setDistributors(result);
      }
    );

    ipcRenderer.send('db-find-distributors');
  }, [setDistributors]);

  if (distributors === null) return <Loading />;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Distributors distributors={distributors} nextRoute={nextRoute} />
    </div>
  );
}
