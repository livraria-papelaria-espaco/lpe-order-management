export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
};

export type CustomerPage = {
  customer: Customer;
};

export type CustomerQueryResult = CustomerPage | false;

export type Book = {
  isbn: string;
  name: string;
  publisher: string;
  provider: string;
  type: 'manual' | 'ca' | 'other';
  schoolYear: number;
  codePe: string;
  stock: number;
  created_at?: Date;
  updated_at?: Date;
};

interface BookWithQuantity extends Book {
  quantity: number;
}

export type BookPage = {
  book: Book;
};

export type BookQueryResult = Book | false;
