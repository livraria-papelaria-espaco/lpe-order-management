import React from 'react';
import CustomerAddFAB from '../components/CustomersPage/CustomerAddFAB';
import CustomerList from '../features/customer-list/CustomerList';

export default function CustomersPage() {
  return (
    <div>
      <CustomerList />
      <CustomerAddFAB />
    </div>
  );
}
