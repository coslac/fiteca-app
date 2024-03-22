/* eslint-disable camelcase */
/* eslint-disable no-undef */
export default function getConfigAPI() {
    const env = process.env.NODE_ENV || 'development';

    return { API_URL: `${process.env.REACT_APP_API_ORIGIN || 'http://localhost:4000'}/api`, APP_URL: `${process.env.REACT_APP_ORIGIN || 'https://app.hallonlab.com.br'}` };
}