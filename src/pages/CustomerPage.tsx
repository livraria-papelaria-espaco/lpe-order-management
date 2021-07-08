import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import BackButton from '../components/BackButton';
import CustomerData from '../components/Customer/CustomerPage/CustomerData';
import Loading from '../components/Loading';
import { Customer, Order } from '../types/database';
import { fetchCustomer, fetchOrders } from '../utils/api';

type ParamType = {
  id: string | undefined;
};

export default function CustomersPage() {
  const { id } = useParams<ParamType>();
  const [customer, setCustomer] = useState<Customer | false>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const [customerResult, ordersResult] = await Promise.all([
        fetchCustomer(parseInt(id ?? '-1', 10)),
        fetchOrders({ customerId: parseInt(id ?? '-1', 10) }),
      ]);

      if (!customerResult) {
        enqueueSnackbar('Cliente não encontrado', { variant: 'error' });
        history.goBack();
        return;
      }

      setCustomer(customerResult);
      setOrders(ordersResult);
    })();
  }, [enqueueSnackbar, history, id]);

  if (!customer) return <Loading />;

  return (
    <div>
      <BackButton />
      <CustomerData customer={customer} orders={orders} />
    </div>
  );
}
