export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export type CustomerPage = {
  customer: Customer;
};
