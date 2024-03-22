/* eslint-disable import/extensions */
import { lazy } from 'react';

const Solicitacao = lazy(() => import('./Solicitacao'));

const SolicitacaoConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'solicitacao',
            element: <Solicitacao />,
        },
    ],
};

export default SolicitacaoConfig;
