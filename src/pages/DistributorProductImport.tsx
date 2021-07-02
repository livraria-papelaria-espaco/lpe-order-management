import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import ImportBooks from '../components/External/ImportBooks';
import { BookWithQuantity } from '../types/database';

export default function DistributorProductExport() {
  const [products, setProducts] = useState<BookWithQuantity[]>([]);

  return (
    <div>
      <BackButton />
      <Typography variant="h5" gutterBottom>
        Importar Produtos de Encomenda
      </Typography>
      <ImportBooks products={products} setProducts={setProducts} />
    </div>
  );
}
