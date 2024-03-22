/* eslint-disable import/extensions */
import { lazy } from 'react';

const Produtos = lazy(() => import('./Produtos'));

const ProdutosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'produtos/',
            element: <Produtos />,
        },
    ],
};

export default ProdutosConfig;
