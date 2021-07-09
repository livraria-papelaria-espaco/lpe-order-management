export interface Timestamp {
  created_at?: Date;
  updated_at?: Date;
}

export interface Customer extends Timestamp {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export type BookType = 'manual' | 'ca' | 'other';

export interface Book extends Timestamp {
  isbn: string;
  name: string;
  publisher: string;
  type: BookType;
  schoolYear: number;
  codePe: string;
  stock: number;
}

interface BookWithQuantity extends Book {
  quantity: number;
}

export type BookPage = {
  book: Book;
};

export type OrderStatus = 'pending' | 'ready' | 'notified' | 'finished';

export interface Order extends Timestamp {
  id: number;
  customer?: Customer;
  status?: OrderStatus;
  notes?: string;
  books?: BookOrder[];
  bookCount?: number;
}

export interface FetchOrdersParams {
  status?: OrderStatus;
  customerId?: number;
}

export interface BookOrder extends Book {
  id: number;
  targetQuantity: number;
  orderedQuantity: number;
  availableQuantity: number;
  pickedupQuantity: number;
  history?: BookOrderHistory[];
}

export type BookOrderHistoryType =
  | 'from_stock'
  | 'ordered'
  | 'arrived'
  | 'pickedup';

export interface BookOrderHistory {
  id: number;
  quantity: number;
  timestamp: Date;
  type: BookOrderHistoryType;
}
