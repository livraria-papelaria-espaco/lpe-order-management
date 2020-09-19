import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import SeeIcon from '@material-ui/icons/VisibilityRounded';
import { Customer } from '../../types/database';
import routes from '../../constants/routes.json';

const { ipcRenderer } = window.require('electron');

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.once('db-result-customers-find', (_, args) =>
      setCustomers([...args])
    );
    ipcRenderer.send('db-customers-find');

    // TODO
    ipcRenderer.on('db-result-customers-insert', (_, args) => {
      // Update view if a new customer is added
      if (args) ipcRenderer.send('db-customers-find');
    });
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="customer table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telemóvel</TableCell>
              <TableCell>Email</TableCell>
              <TableCell padding="checkbox" align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: Customer) => (
              <TableRow
                hover
                onClick={() => {
                  history.push(
                    routes.CUSTOMER.replace(':id', `${customer.id}`)
                  );
                }}
                key={customer.id}
              >
                <TableCell component="th" scope="row">
                  {customer.name}
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell padding="checkbox" align="right">
                  <Button startIcon={<SeeIcon />} color="primary">
                    Ver&nbsp;&amp;&nbsp;Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
