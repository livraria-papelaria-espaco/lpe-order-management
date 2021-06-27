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

export type CustomerPage = {
  customer: Customer;
};

export type CustomerQueryResult = CustomerPage | false;

export interface Book extends Timestamp {
  isbn: string;
  name: string;
  publisher: string;
  type: 'manual' | 'ca' | 'other';
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

export type BookQueryResult = Book | false;

export type OrderStatus = 'pending' | 'ready' | 'notified' | 'finished';

export interface Order extends Timestamp {
  id: number;
  customer?: Customer;
  status: OrderStatus;
  notes: string;
  books?: BookOrder[];
  bookCount?: number;
}

export interface BookOrder extends Book {
  id: number;
  targetQuantity: number;
  orderedQuantity: number;
  availableQuantity: number;
  pickedupQuantity: number;
}
