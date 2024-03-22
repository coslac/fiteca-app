/* eslint-disable import/extensions */
import { lazy } from 'react';

const Paciente = lazy(() => import('./Paciente'));

const PacienteConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'paciente/:id',
            element: <Paciente />,
        },
        {
            path: 'paciente',
            element: <Paciente />,
        },
    ],
};

export default PacienteConfig;
