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
import SeeIcon from '@material-ui/icons/VisibilityRounded';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import routes from '../../constants/routes.json';
import { Customer } from '../../types/database';

const { ipcRenderer } = window.require('electron');

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const history = useHistory();

  const refreshView = useCallback(() => {
    ipcRenderer.once('db-result-customers-find', (_, args) =>
      setCustomers([...args])
    );
    ipcRenderer.send('db-customers-find');
  }, []);
  const handleEventRefresh = useCallback(
    (_, sucess) => sucess && refreshView(),
    [refreshView]
  );

  useEffect(() => {
    refreshView();

    ipcRenderer.on('db-result-customers-insert', handleEventRefresh);

    return () => {
      ipcRenderer.removeListener(
        'db-result-customers-insert',
        handleEventRefresh
      );
    };
  }, [handleEventRefresh, refreshView]);

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
