import { Chip } from '@material-ui/core';
import React from 'react';

import { orderBookStatus } from '../../../constants/enums';
import { BookOrder } from '../../../types/database';

interface Props {
  orderBook: BookOrder;
}

const calculateStatus = (orderBook: BookOrder) => {
  const {
    targetQuantity,
    orderedQuantity,
    availableQuantity,
    pickedupQuantity,
  } = orderBook;

  if (orderedQuantity !== targetQuantity) return orderBookStatus.pending;
  if (availableQuantity !== targetQuantity) return orderBookStatus.ordered;
  if (pickedupQuantity !== targetQuantity) return orderBookStatus.arrived;

  return orderBookStatus.completed;
};

export default function OrderBookStatusChip({ orderBook }: Props) {
  const { color, displayName } = calculateStatus(orderBook);

  return (
    <Chip
      style={{ backgroundColor: color, color: '#fff' }}
      label={displayName}
    />
  );
}
