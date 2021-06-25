import React from 'react';
import NewOrder from '../components/Orders/NewOrder';
import BackButton from '../components/BackButton';

export default function OrderNewPage() {
  return (
    <div>
      <BackButton />
      <NewOrder />
    </div>
  );
}
