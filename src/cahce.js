const { getFlights } = require('./flights-api');

const cache = {
    data: null,
    timestamp: null,
}

const cacheDuration = 60000;

async function getFlightsData() {
    // This function is used in each one of the endpoints for getting the data from the api.
    // The function either gets new data from the api or gets the past minute data saved in the 'cache'.

    const now = Date.now()
    const noCache = !cache.data;
    const cacheOutdated = now - cache.timestamp > cacheDuration;

    if (noCache || cacheOutdated) {
        try {
            cache.data = await getFlights();
            cache.timestamp = now;

            return cache
        }

        catch (error) {
            console.error(`error while getting fights data from api: ${error}`);
            throw error;
        }
    }

    else {
        return cache
    }
}

module.exports = {
    getFlightsData,
}