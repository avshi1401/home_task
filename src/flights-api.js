const { baseURL } = require('./constants');
const axios = require('axios');

async function getFlights() {
    // This function is used when there is no data in the cache or the data is one minute old.

    try {
        const response = await axios.get(baseURL);

        return response.data['result']['records'];
    }

    catch (error) {
        console.error(`error while getting flights: ${error}`);
        throw error;
    }
}

module.exports = {
    getFlights
}