/* eslint-disable import/extensions */
import { lazy } from 'react';

const Pacientes = lazy(() => import('./Pacientes'));

const PacientesConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'pacientes/',
            element: <Pacientes />,
        },
    ],
};

export default PacientesConfig;
