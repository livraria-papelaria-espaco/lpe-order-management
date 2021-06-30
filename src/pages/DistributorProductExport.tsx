import { Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import ExportBooks from '../components/External/ExportBooks';
import Loading from '../components/Loading';
import { BookWithQuantity } from '../types/database';

const { ipcRenderer } = require('electron');

interface ParamType {
  name: string | undefined;
}

export default function DistributorProductExport() {
  const { name } = useParams<ParamType>();
  const [products, setProducts] = useState<BookWithQuantity[] | null>(null);

  const refreshProducts = useCallback(() => {
    ipcRenderer.once(
      'db-distributor-list-export-books-result',
      (_: unknown, books: BookWithQuantity[]) => {
        setProducts(books);
      }
    );

    ipcRenderer.send('db-distributor-list-export-books', name);
  }, [name]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (products === null) return <Loading />;

  return (
    <div>
      <BackButton />
      <Typography variant="h5" gutterBottom>
        Exportar Produtos para {name}
      </Typography>
      <ExportBooks products={products} refreshProducts={refreshProducts} />
    </div>
  );
}
