import React from 'react';
import CustomerAddFAB from '../components/CustomersPage/CustomerAddFAB';
import CustomerList from '../components/Customer/CustomerList';

export default function CustomersPage() {
  return (
    <div>
      <CustomerList />
      <CustomerAddFAB />
    </div>
  );
}
