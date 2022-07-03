const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: 'Authorization Bot',
        clinic_id: 1
    }
});

module.exports = api;