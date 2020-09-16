import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Customer } from '../../types/database';

const { ipcRenderer } = window.require('electron');

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    ipcRenderer.on('db-result-customers-find', (_, args) =>
      setCustomers([...args])
    );
    ipcRenderer.send('db-customers-find');
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="customer table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Telemóvel</TableCell>
              <TableCell align="right">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell component="th" scope="row">
                  {customer.name}
                </TableCell>
                <TableCell align="right">{customer.phone}</TableCell>
                <TableCell align="right">{customer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
