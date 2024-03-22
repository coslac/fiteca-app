import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'gestao-de-produtos',
    title: 'Gestão de Produtos',
    subtitle: 'Gerenciamento de Produtos',
    type: 'group',
    children: [
      {
        id: 'produtos',
        title: 'Produtos',
        type: 'item',
        icon: 'heroicons-outline:view-list',
        url: '/produtos',
      },
    ],
  },
  {
    id: 'gestao-de-estoque',
    title: 'Gestão de Estoque',
    subtitle: 'Gerenciamento de Estoque',
    type: 'group',
    children: [
      {
        id: 'estoque',
        title: 'Estoque',
        type: 'item',
        icon: 'heroicons-outline:archive-box',
        url: '/estoque',
      },
    ],
  },
  {
    id: 'gestao-de-pedidos',
    title: 'Gestão de Pedidos',
    subtitle: 'Gerenciamento de Pedidos',
    type: 'group',
    children: [
      {
        id: 'pedidos',
        title: 'Pedidos',
        type: 'item',
        icon: 'heroicons-outline:archive-box',
        url: '/pedidos',
      },
    ],
  },
  {
    id: 'area-usuario',
    title: 'Área do Usuário',
    subtitle: 'Gerenciamento de Conta do Usuário',
    type: 'group',
    children: [
      {
        id: 'minha-conta',
        title: 'Minha Conta',
        type: 'item',
        icon: 'heroicons-outline:user',
        url: '/minha-conta',
      },
      {
        id: 'sair',
        title: 'Sair',
        type: 'item',
        icon: 'heroicons-outline:logout',
        url: '/logout',
      },
    ],
  },
];

export default navigationConfig;
