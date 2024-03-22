/* eslint-disable import/extensions */
import { lazy } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

const DashboardConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: '/',
            element: <Dashboard />,
        },
    ],
};

export default DashboardConfig;
