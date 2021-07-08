import { ListSubheader } from '@material-ui/core';
import OrderOutIcon from '@material-ui/icons/ArrowDownwardRounded';
import OrderInIcon from '@material-ui/icons/ArrowUpwardRounded';
import BookIcon from '@material-ui/icons/BookRounded';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartRounded';
import React from 'react';
import routes from '../../constants/routes';
import LinkItem from './LinkItem';

export const mainListItems = (
  <div>
    <LinkItem
      icon={<DashboardIcon />}
      text="Visão Geral"
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
  </div>
);

export const externalOrderListItems = (
  <div>
    <ListSubheader inset>Encomendas Externas</ListSubheader>
    <LinkItem
      icon={<SettingsIcon />}
      text="Configuração Dist."
      to={routes.EXTERNAL_ORDER_SETTINGS}
    />
    <LinkItem
      icon={<OrderOutIcon />}
      text="Saída de Produtos"
      to={routes.EXTERNAL_ORDER_OUT}
    />
    <LinkItem
      icon={<OrderInIcon />}
      text="Entrada de Produtos"
      to={routes.EXTERNAL_ORDER_IN}
    />
  </div>
);
