/* eslint-disable import/extensions */
import { lazy } from 'react';

const EstoqueProdutoItem = lazy(() => import('./EstoqueProdutoItem'));

const EstoqueProdutoItemConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'estoque/:idProduto/item',
            element: <EstoqueProdutoItem />,
        },
        {
            path: 'estoque/:idProduto/item/:idItem',
            element: <EstoqueProdutoItem />,
        },
    ],
};

export default EstoqueProdutoItemConfig;
