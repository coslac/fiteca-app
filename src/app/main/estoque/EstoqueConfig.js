/* eslint-disable import/extensions */
import { lazy } from 'react';

const EstoqueProduto = lazy(() => import('./EstoqueProduto'));

const EstoqueConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'estoque/:id',
            element: <EstoqueProduto />,
        },
    ],
};

export default EstoqueConfig;
