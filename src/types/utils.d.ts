export interface OrderDeleteProps {
  deleteAll: boolean;
  orderBooks: Record<number, OrderBooksDeleteProps>;
}

export interface OrderBooksDeleteProps {
  orderedOnly: number;
  available: number;
  ordersWaitingForBooks: number;
}
