# Flight Data API

## Description

This project is a Node.js application using Express to provide various endpoints for retrieving and filtering flight data. It includes functionality to fetch and cache flight data, filter flights, identify delayed flights, find the most popular destination, and suggest a quick getaway.

## Files

- **server.js**: Main server file that defines endpoints for the API.
- **cache.js**: Contains caching logic for flight data.
- **constants.js**: Stores configuration constants.
- **flights-api.js**: Handles data retrieval from the external API.
- **utils.js**: Provides utility functions for filtering and processing flight data.

## Endpoints

- **`GET /flights`**
  - Retrieves total number of flights, optionally filtered by country.

- **`GET /outbound-flights`**
  - Retrieves the number of outbound flights, optionally filtered by country.

- **`GET /inbound-flights`**
  - Retrieves the number of inbound flights, optionally filtered by country.

- **`GET /delayed-flights`**
  - Retrieves the number of delayed flights.

- **`GET /most-popular-destination`**
  - Retrieves the most popular destination based on flight data.

- **`GET /quick-gateaway`**
  - Retrieves a quick getaway option to Israel, if data is sufficient.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/avshi1401/elbit_task.git
    ```
2. Navigate to the project directory:
    ```bash
    cd elbit_task
    ```
3. Create the docker:
    ```bash
    sudo docker build -t app .
    sudo docker run -p 8080:8080 -d app
    ```

## Running the Application

Open the following URL:
```
http://127.0.0.1:8080
```
