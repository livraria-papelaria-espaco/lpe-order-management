import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ArrivedIcon from '@material-ui/icons/AllInboxRounded';
import FromStockIcon from '@material-ui/icons/BallotRounded';
import OrderedIcon from '@material-ui/icons/ShoppingBasketRounded';
import PickedupIcon from '@material-ui/icons/StorefrontRounded';
import React from 'react';
import { BookOrderHistory } from '../../../types/database';

interface Props {
  history: BookOrderHistory;
}

const getText = (type: string, quantity: number) => {
  if (type === 'from_stock') {
    if (quantity === 1)
      return `Foi movido 1 item do stock da loja para esta encomenda`;
    return `Foram movidos ${quantity} itens do stock da loja para esta encomenda`;
  }
  if (type === 'ordered') {
    if (quantity === 1) return `Foi encomendado 1 item à distribuidora`;
    return `Foram encomendados ${quantity} itens à distribuidora`;
  }
  if (type === 'arrived') {
    if (quantity === 1)
      return `Chegou 1 item que foi encomendado à distribuidora`;
    return `Chegaram ${quantity} itens que foram encomendados à distribuidora`;
  }
  if (type === 'pickedup') {
    if (quantity === 1) return `Foi levantado 1 item pelo cliente`;
    return `Foram levantados ${quantity} itens pelo cliente`;
  }
  return '';
};

const getIcon = (type: string) => {
  if (type === 'from_stock') return <FromStockIcon />;
  if (type === 'ordered') return <OrderedIcon />;
  if (type === 'arrived') return <ArrivedIcon />;
  if (type === 'pickedup') return <PickedupIcon />;
  return '';
};

export default function BookOrderHistoryItem({ history }: Props) {
  const description = getText(history.type, history.quantity);
  const icon = getIcon(history.type);

  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>
        <strong>{history.timestamp.toLocaleString('pt-PT')} - </strong>
        {description}
      </ListItemText>
    </ListItem>
  );
}
