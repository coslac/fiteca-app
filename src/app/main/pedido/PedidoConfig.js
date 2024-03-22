/* eslint-disable import/extensions */
import { lazy } from 'react';

const Pedido = lazy(() => import('./Pedido'));

const PedidoConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'pedido/:id',
            element: <Pedido />,
        },
        {
            path: 'pedido/',
            element: <Pedido />,
        },
    ],
};

export default PedidoConfig;
