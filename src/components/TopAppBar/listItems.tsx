import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BookIcon from '@material-ui/icons/BookRounded';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LayersIcon from '@material-ui/icons/Layers';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartRounded';
import React from 'react';
import routes from '../../constants/routes';
import LinkItem from './LinkItem';

export const mainListItems = (
  <div>
    <LinkItem
      icon={<DashboardIcon />}
      text="Dashboard"
      to={routes.HOME}
      exact
    />
    <LinkItem
      icon={<ShoppingCartIcon />}
      text="Encomendas"
      to={routes.ORDERS}
    />
    <LinkItem icon={<PeopleIcon />} text="Clientes" to={routes.CUSTOMERS} />
    <LinkItem icon={<BookIcon />} text="Livros" to={routes.BOOKS} />
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
