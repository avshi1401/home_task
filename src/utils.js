function filterFlights(flights, outbound, country) {
    // This function filters flights based on the parameters given.
    // The 'flights' parameter is the flights data from the api.
    // The 'outbound' parameter is for getting only outbound, only inbound or both of the options (true -> outbound, false -> inbound, null -> both).
    // The 'country' parameter is for getting flights only for specifc country.

    if (outbound === null) {
        if (country) {
            const filteredFlights = flights.filter(
                flight => flight.CHLOCCT === country,
            );

            return filteredFlights;
        }

        return flights;
    }

    else if (outbound) {
        if (country) {
            const filteredFlights = flights.filter(
                flight => flight.CHCINT !== null && flight.CHLOCCT === country,
            );

            return filteredFlights;
        }

        const filteredFlights = flights.filter(
            flight => flight.CHCINT !== null,
        );

        return filteredFlights;
    }

    else if (country) {
        const filteredFlights = flights.filter(
            flight => flight.CHCINT === null && flight.CHLOCCT === country,
        );

        return filteredFlights;
    }

    const filteredFlights = flights.filter(
        flight => flight.CHCINT === null,
    );

    return filteredFlights;
}

function filterDelayedFlights(flights) {
    // This function is specificly for the delayed flights endpoint.

    const filteredFlights = flights.filter(
        flight => flight.CHRMINE === 'DELAYED',
    );

    return filteredFlights;
}

function getMostPopularDestination(flights) {
    // This function is specificly for the most popular desination enpoint.

    const destinationsCounter = flights.reduce(
        (counter, flight) => {
            const destination = flight.CHLOC1T;

            counter[destination] = (counter[destination] || 0) + 1;
            
            return counter;
        },
        {},
    )

    let mostPopularDestination = null;
    let maxCount = 0;

    for (const [destination, count] of Object.entries(destinationsCounter)) {
        if (count > maxCount) {
            mostPopularDestination = destination;
            maxCount = count;
        }
    }

    return mostPopularDestination;
}

function getQuickGateaway(flights) {
    // This function is specificly for the quick gateaway endpoint.

    for (let i = 0; i < flights.length - 1; i++) {
        const flight = flights[i];
        const flightDestination = flight.CHLOC1T;
        const flightDepartureTime = flight.CHSTOL;
        const flightOutbound = flight.CHCINT !== null;

        for (let j = i + 1; j < flights.length; j++) {
            const comparingFlight = flights[j];
            const comparingFlightDestination = comparingFlight.CHLOC1T;
            const comparingFlightDepartureTime = comparingFlight.CHSTOL;
            const comparingFlightOutbound = comparingFlight.CHCINT !== null;

            const sameDestination = flightDestination === comparingFlightDestination;
            const laterDepartureTime = ((flightOutbound && flightDepartureTime < comparingFlightDepartureTime) || (!flightOutbound && flightDepartureTime > comparingFlightDepartureTime));
            const outboundAndInbound = flightOutbound !== comparingFlightOutbound;

            if (sameDestination && laterDepartureTime && outboundAndInbound) {
                const flightCodeAndNumber = `${flight.CHOPER}${flight.CHFLTN}`;
                const comparingFlightCodeAndNumber = `${comparingFlight.CHOPER}${comparingFlight.CHFLTN}`;

                if (flightOutbound) {
                    const gateaway = {
                        departure: flightCodeAndNumber,
                        arrival: comparingFlightCodeAndNumber,
                    }

                    return gateaway
                }

                const gateaway = {
                    departure: comparingFlightCodeAndNumber,
                    arrival: flightCodeAndNumber,
                }

                return gateaway;
            }
        }
    }

    return null;
}

module.exports = {
    filterFlights,
    filterDelayedFlights,
    getMostPopularDestination,
    getQuickGateaway,
}