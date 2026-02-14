const express = require("express");
const session = require("express-session");

const port = process.env.PORT || 3000;

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET || 'fanciullina',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false},
}));

const WebApiController = require("./controllers/index");
const SpidLoginController = require("./controllers/spidLogin");
const WeatherController = require("./controllers/weather");

app.get("/", (request, response) => {
    response.json({
        status: 200, result: null, message: "Hello, World!", debug: null
    });
});

app.get("/api/v1/spid/login", async (request, response) => {
    if (Object.keys(request.session).includes("SPIDToken")) {
        let spidToken = request.session["SPIDToken"];
        let spidUserScopes = await SpidLoginController.getUserScopes(spidToken);

        if (spidUserScopes != null) {
            WebApiController.sendResponse(request, response, spidUserScopes, "");
        } else {
            delete request.session["SPIDToken"];

            WebApiController.sendError(request, response, 401, {
                type: "unauthorized",
                title: "Unauthorized",
                status: 401,
                details: "The current session has not been authenticated with a valid SPID IdP."
            });
        }
    } else {
        SpidLoginController.doLogin(request, response);
    }
});

app.get("/api/v1/spid/logout", (request, response) => {
    delete request.session["SPIDToken"];
    WebApiController.sendResponse(request, response, null, "");
});

app.get("/api/v1/weather", async (request, response) => {
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

/*
app.post("/api/v1/spid/login", async (request, response) => {
    if (Object.keys(request.session).includes("SPIDToken")) {
        let spidToken = request.session["SPIDToken"];
        let spidUserScopes = await SpidLoginController.getUserScopes(spidToken);

        if (spidUserScopes != null) {
            WebApiController.sendResponse(request, response, spidUserScopes, "");
        } else {
            delete request.session["SPIDToken"];

            WebApiController.sendError(request, response, 401, {
                type: "unauthorized",
                title: "Unauthorized",
                status: 401,
                details: "The current session has not been authenticated with a valid SPID IdP."
            });
        }
    } else {
        WebApiController.sendError(request, response, 401, {
            type: "unauthorized",
            title: "Unauthorized",
            status: 401,
            details: "The current session has not been authenticated with a valid SPID IdP."
        });
    }
});
*/

app.get("/api/v1/spid/callback", async (request, response) => {
    await SpidLoginController.handleCallback(request, response);
});

app.get("/api/v1/session", (request, response) => {
    WebApiController.sendResponse(request, response, request.session, "");
});

app.use((request, response, next) => {
    WebApiController.sendError(request, response, 404, {
        type: "not-found",
        title: "Resource not found",
        status: 404,
        details: "The requested resource was not found on this server."
    });
});

app.listen(port, () => {
    console.log("API started on port: " + port);
});