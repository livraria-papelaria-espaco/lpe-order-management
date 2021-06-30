import { Chip } from '@material-ui/core';
import React from 'react';

import { orderStatus } from '../../constants/enums';
import { OrderStatus } from '../../types/database';

interface Props {
  status: OrderStatus;
}

export default function OrderStatusChip({ status }: Props) {
  return (
    <Chip
      style={{ backgroundColor: orderStatus[status].color, color: '#fff' }}
      label={orderStatus[status].displayName}
    />
  );
}
