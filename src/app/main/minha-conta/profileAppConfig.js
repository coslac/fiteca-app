import { lazy } from 'react';

const ProfileApp = lazy(() => import('./ProfileApp'));

const MinhaContaConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'minha-conta/',
      element: <ProfileApp />,
    },
  ],
};

export default MinhaContaConfig;
