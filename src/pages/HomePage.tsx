import React, { useEffect, useState } from 'react';

import Home from '../components/Dashboard/Home';
import Loading from '../components/Loading';
import { Order, OrderStatus } from '../types/database';
import { fetchOrders, getOrdersCountByStatus } from '../utils/api';

export default function HomePage() {
  const [overviewData, setOverviewData] = useState<Record<
    OrderStatus,
    string
  > | null>(null);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [notifiedOrders, setNotifiedOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const [
        overviewDataResult,
        readyOrdersResult,
        notifiedOrdersResult,
      ] = await Promise.all([
        getOrdersCountByStatus(),
        fetchOrders({ status: 'ready' }),
        fetchOrders({ status: 'notified' }),
      ]);
      setOverviewData(overviewDataResult);
      setReadyOrders(readyOrdersResult);
      setNotifiedOrders(notifiedOrdersResult);
    })();
  }, []);

  if (overviewData === null) return <Loading />;

  return (
    <Home
      overviewData={overviewData}
      readyOrders={readyOrders}
      notifiedOrders={notifiedOrders}
    />
  );
}
