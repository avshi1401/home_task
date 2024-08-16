const express = require('express');
const { query, validationResult } = require('express-validator');
const { getFlightsData } = require('./src/cahce');
const { port, baseURL } = require('./src/constants');
const { filterFlights, filterDelayedFlights, getMostPopularDestination, getQuickGateaway } = require('./src/utils');

const app = express();

app.get(
    '/flights',
    [
        query('country').optional().isString().withMessage('country parameter must be string'),
    ],
    async (req, res) => {
        // This endpoint controlls the requests for outbound and inbound flights together.
        // It has a 'country' url parameter that can be used for getting data on specifc country.

        try {
            const queryParamsErrors = validationResult(req);

            if (!queryParamsErrors.isEmpty()) {
                const response = {
                    data: {
                        error: queryParamsErrors.array(),
                    }
                }

                res.status(400).json(response);
            }

            const { country = null } = req.query;
            const flights = await getFlightsData();

            const filteredFlights = filterFlights(
                flights.data,
                null,
                country,
            )
            const numberOfFlights = filteredFlights.length;
        
            const response = {
                data: {
                    country: country,
                    numberOfFlights: numberOfFlights,
                },
            }

            res.status(200).json(response);
        }

        catch (error) {
            console.error(`error while getting number of flights: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                },
            }

            res.status(500).json(response)
        }
    }
);

app.get(
    '/outbound-flights',
    [
        query('country').optional().isString().withMessage('country parameter must be string'),
    ],
    async (req, res) => {
        // This endpoint controlls the requests for only outbound flights.
        // It has a 'country' url parameter that can be used for getting data on specifc country.

        try {
            const queryParamsErrors = validationResult(req);

            if (!queryParamsErrors.isEmpty()) {
                const response = {
                    data: {
                        error: queryParamsErrors.array(),
                    }
                }

                res.status(400).json(response);
            }

            const { country = null } = req.query;
            const flights = await getFlightsData();
            
            const filteredFlights = filterFlights(
                flights.data,
                true,
                country,
            )
            const numberOfOutboundFlights = filteredFlights.length;

            const response = {
                data: {
                    country: country,
                    numberOfOutboundFlights: numberOfOutboundFlights,
                },
            }

            res.status(200).json(response);
        }

        catch (error) {
            console.error(`error while getting number of outbound flights: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                },
            }

            res.status(500).json(response)
        }
    }
)

app.get(
    '/inbound-flights',
    [
        query('country').optional().isString().withMessage('country parameter must be string'),
    ],
    async (req, res) => {
        // This endpoint controlls the requests for only inbound flights.
        // It has a 'country' url parameter that can be used for getting data on specifc country.

        try {
            const { country = null } = req.query;
            const flights = await getFlightsData();

            const filteredFlights = filterFlights(
                flights.data,
                false,
                country,
            )
            const numberOfInboundFlights = filteredFlights.length;

            const response = {
                data: {
                    country: country,
                    numberOfInboundFlights: numberOfInboundFlights,
                },
            }

            res.status(200).json(response);
        }

        catch (error) {
            console.error(`error while getting number of inbound flights: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                },
            }

            res.status(500).json(response)
        }
    }
)

app.get(
    '/delayed-flights',
    async (req, res) => {
        // This endpoint controlls the requests for delayed flights.

        try {
            const flights = await getFlightsData();

            const filteredFlights = filterDelayedFlights(
                flights.data,
            );
            const numberOfDelayedFlights = filteredFlights.length;

            const response = {
                data: {
                    numberOfDelayedFlights: numberOfDelayedFlights,
                }
            }

            res.status(200).json(response);
        }

        catch (error) {
            console.error(`error while getting number of delayed flights: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                }
            }

            res.status(500).json(response);
        }
    }
)

app.get(
    '/most-popular-destination',
    async (req, res) => {
        // This endpoint controlls the requests the most popular destination.

        try {
            const flights = await getFlightsData();

            const filteredFlights = filterFlights(
                flights.data,
                true,
                null,
            );

            const mostPopularDestination = getMostPopularDestination(
                filteredFlights,
            );

            const response = {
                data: {
                    mostPopularDestination: mostPopularDestination,
                }
            }

            res.status(200).json(response);
        }

        catch (error) {
            console.error(`error while getting the most popular destination: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                }
            }

            res.status(500).json(response);
        }
    }
)

app.get(
    '/quick-gateaway',
    async (req, res) => {
        // This endpoint controlls the requests for a quick gateaway to Israel (the bonus task).

        try {
            const flights = await getFlightsData();

            const gateaway = getQuickGateaway(
                flights.data,
            )
            
            if (gateaway) {
                const response = {
                    data: {
                        gateaway: gateaway,
                    },
                }

                res.status(200).json(response);
            }

            res.status(204).end();
        }

        catch (error) {
            console.error(`error while getting quick gateaway: ${error}`);
            console.error(error.stack);

            const response = {
                data: {
                    error: 'Internal Server Error',
                }
            }

            res.status(500).json(response);
        }
    }
)

app.listen(
    port,
    () => {
        console.log(`server running on http://127.0.0.1:${port}`);
    }
)
