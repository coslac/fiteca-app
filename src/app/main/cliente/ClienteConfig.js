/* eslint-disable import/extensions */
import { lazy } from 'react';

const Cliente = lazy(() => import('./Cliente'));

const ClienteConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'cliente/:id',
            element: <Cliente />,
        },
        {
            path: 'cliente',
            element: <Cliente />,
        },
    ],
};

export default ClienteConfig;
