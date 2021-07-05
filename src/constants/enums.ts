export const bookTypes = {
  manual: {
    displayName: 'Manual Escolar',
    color: '#0288d1',
  },
  ca: {
    displayName: 'Caderno de Atividades',
    color: '#43a047',
  },
  other: {
    displayName: 'Não Escolar',
    color: '#ff8f00',
  },
};

export const orderStatus = {
  pending: {
    displayName: 'Em Processamento',
    color: '#ed823b',
  },
  ready: {
    displayName: 'Pronta (Cliente Não Notificado)',
    color: '#f7ba2c',
  },
  notified: {
    displayName: 'Cliente Notificado',
    color: '#2095b2',
  },
  finished: {
    displayName: 'Finalizada',
    color: '#4cce2b',
  },
};

export default {
  bookTypes,
};
