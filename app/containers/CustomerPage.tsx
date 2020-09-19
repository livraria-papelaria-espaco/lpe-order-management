import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CustomerData from '../components/CustomerPage/CustomerData';
import { CustomerPage } from '../types/database';

const { ipcRenderer } = window.require('electron');

type ParamType = {
  id: string | undefined;
};

export default function CustomersPage() {
  const { id } = useParams<ParamType>();
  const [data, setData] = useState<CustomerPage>();

  useEffect(() => {
    ipcRenderer.send('db-customer-find-one', id);
    ipcRenderer.on('db-result-customer-find-one', (_, response) => {
      setData(response);
    });
  }, [id]);

  // TODO add pretty loader
  if (!data) return <div>A carregar...</div>;

  return (
    <div>
      <CustomerData customer={data?.customer} />
    </div>
  );
}
