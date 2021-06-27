import {
  fade,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { FocusEvent } from 'react';

const useStyles = makeStyles((theme) => ({
  emptyPublisher: {
    backgroundColor: fade(theme.palette.error.light, 0.25),
  },
}));

interface Props {
  distributorMap: Record<string, string | null>;
  update(publisher: string, distributor: string | null): void;
}

export default function DistributorList({ distributorMap, update }: Props) {
  const classes = useStyles();

  const allDistributors = [
    ...new Set(Object.values(distributorMap).filter((v) => v)),
  ];

  const onDistributorChange = (publisher: string) => (
    event: FocusEvent<HTMLInputElement>
  ) => {
    update(publisher, event.target.value || null);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="distributor publisher table">
        <TableHead>
          <TableRow>
            <TableCell>Editora</TableCell>
            <TableCell>Distribuidora</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(distributorMap).map(([publisher, distributor]) => (
            <TableRow
              key={publisher}
              className={distributor ? '' : classes.emptyPublisher}
            >
              <TableCell component="th" scope="row">
                {publisher}
              </TableCell>
              <TableCell>
                <Autocomplete
                  freeSolo
                  options={allDistributors}
                  value={distributor}
                  onBlur={onDistributorChange(publisher)}
                  renderInput={(params) => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      label="Distribuidora"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
