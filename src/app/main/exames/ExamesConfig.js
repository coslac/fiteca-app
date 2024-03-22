/* eslint-disable import/extensions */
import { lazy } from 'react';

const Exames = lazy(() => import('./Exames'));

const ExamesConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'exames/',
            element: <Exames />,
        },
    ],
};

export default ExamesConfig;
