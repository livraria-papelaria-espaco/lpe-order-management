import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import SeeIcon from '@material-ui/icons/VisibilityRounded';
import React from 'react';
import { useHistory } from 'react-router';
import routes from '../../constants/routes';
import { BookOrder, Order } from '../../types/database';
import OrderStatusChip from './OrderStatusChip';

interface Props {
  orders: Order[];
}

export default function CustomerList({ orders }: Props) {
  const history = useHistory();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Qnt. Livros</TableCell>
              <TableCell padding="checkbox" align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow
                hover
                onClick={() => {
                  history.push(routes.ORDER.replace(':id', `${order.id}`));
                }}
                key={order.id}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell component="th" scope="row">
                  {order.customer?.name}
                </TableCell>
                <TableCell>
                  <OrderStatusChip status={order.status ?? 'pending'} />
                </TableCell>
                <TableCell>
                  {order.created_at?.toLocaleString('pt-PT')}
                </TableCell>
                <TableCell>{`${order.books?.reduce(
                  (sum: number, book: BookOrder) =>
                    sum + book.availableQuantity,
                  0
                )}/${order.books?.reduce(
                  (sum: number, book: BookOrder) => sum + book.pickedupQuantity,
                  0
                )}/${order.books?.reduce(
                  (sum: number, book: BookOrder) => sum + book.targetQuantity,
                  0
                )}`}</TableCell>
                <TableCell padding="checkbox" align="right">
                  <Button startIcon={<SeeIcon />} color="primary">
                    Ver&nbsp;&amp;&nbsp;Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
