const express = require('express');
const router = express.Router();

const WebApiController = require('../controllers/index');
const WeatherController = require('../controllers/weatherController');
const {request, response} = require("express");

router.get("/", async (request, response) => {
    let weatherData = await WeatherController.getWeather();

    if (weatherData != null) {
        WebApiController.sendResponse(request, response, weatherData, "");
    } else {
        WebApiController.sendError(request, response, 500, {
            type: "internal-server-error",
            title: "Internal Server Error",
            status: 500,
            details: "An error has occurred while obtaining data from api.open-meteo.com."
        });
    }
});

module.exports = router;
