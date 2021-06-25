import {
  Card,
  CardContent,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddRounded';
import { Autocomplete } from '@material-ui/lab';
import React, { useCallback, useEffect, useState } from 'react';
import { Customer } from '../../../types/database';
import CustomerAddDialog from '../../Customer/CustomerAddDialog';

const { ipcRenderer } = require('electron');

interface Props {
  customer: Customer | null;
  setCustomer(customer: Customer | null): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  autocomplete: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

export default function CustomerSelector({ customer, setCustomer }: Props) {
  const classes = useStyles();
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const createCustomerCallback = useCallback(
    (c: Customer) => {
      setCustomerOptions((v) => [c, ...v]);
      setCustomer(c);
    },
    [setCustomer, setCustomerOptions]
  );

  const toggleDialog = useCallback(() => setDialogOpen((v) => !v), [
    setDialogOpen,
  ]);

  useEffect(() => {
    ipcRenderer.once(
      'db-result-customers-find',
      (_: unknown, customers: Customer[]) => {
        setCustomerOptions(customers);
      }
    );

    ipcRenderer.send('db-customers-find');
  }, []);

  return (
    <>
      <CustomerAddDialog
        open={dialogOpen}
        handleClose={toggleDialog}
        createdCallback={createCustomerCallback}
      />
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5">Escolher Cliente</Typography>
          <div className={classes.row}>
            <Autocomplete
              className={classes.autocomplete}
              value={customer}
              onChange={(_, newValue: Customer | null) => {
                setCustomer(newValue);
              }}
              options={customerOptions}
              classes={{
                option: classes.option,
              }}
              autoHighlight
              getOptionLabel={(option: Customer) =>
                [option.name, option.phone, option.email]
                  .filter((v) => v)
                  .join(' ')
              }
              renderOption={(option: Customer) => (
                <>
                  <span>{option.name}</span>
                  {option.phone} {option.email}
                </>
              )}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label="Procurar Cliente"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <IconButton color="secondary" onClick={toggleDialog}>
              <AddIcon />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
