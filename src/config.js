/* eslint-disable camelcase */
/* eslint-disable no-undef */
export default function getConfigAPI() {
    return { API_URL: `${process.env.REACT_APP_API_ORIGIN}`, APP_URL: `${process.env.REACT_APP_ORIGIN}` };
}