/* eslint-disable import/extensions */
import { lazy } from 'react';

const Exame = lazy(() => import('./Exame'));

const ExameConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'exame/:id',
            element: <Exame />,
        },
        {
            path: 'exame',
            element: <Exame />,
        },
    ],
};

export default ExameConfig;
