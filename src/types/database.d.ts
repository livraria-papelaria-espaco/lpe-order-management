export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type CustomerPage = {
  customer: Customer;
};
