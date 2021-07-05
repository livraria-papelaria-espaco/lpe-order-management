import { Typography } from '@material-ui/core';
import React from 'react';
import ImportBooks from '../components/External/ImportBooks';
import { BookWithQuantity } from '../types/database';
import useLocalStorage from '../utils/hooks';

export default function DistributorProductExport() {
  const [products, setProducts] = useLocalStorage<BookWithQuantity[]>(
    'distributor-import',
    []
  );

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Importar Produtos de Encomenda
      </Typography>
      <ImportBooks products={products} setProducts={setProducts} />
    </div>
  );
}
