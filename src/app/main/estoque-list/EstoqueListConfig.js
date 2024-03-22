/* eslint-disable import/extensions */
import { lazy } from 'react';

const Estoque = lazy(() => import('./Estoque'));

const EstoqueListConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'estoque/',
            element: <Estoque />,
        },
    ],
};

export default EstoqueListConfig;
