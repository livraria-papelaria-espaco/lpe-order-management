import { Chip } from '@material-ui/core';
import React from 'react';
import { bookTypes } from '../../constants/enums';
import { BookType } from '../../types/database';

interface Props {
  type: BookType;
}

export default function OrderStatusChip({ type }: Props) {
  return (
    <Chip
      style={{ backgroundColor: bookTypes[type]?.color, color: '#fff' }}
      label={bookTypes[type]?.displayName}
    />
  );
}
