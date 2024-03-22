/* eslint-disable import/extensions */
import { lazy } from 'react';

const Produto = lazy(() => import('./Produto'));

const ProdutoConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'produto',
            element: <Produto />,
        },
        {
            path: 'produto/:id',
            element: <Produto />,
        },
    ],
};

export default ProdutoConfig;
