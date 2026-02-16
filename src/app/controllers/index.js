const {request, response} = require("express");

const WebApiController = {
    sendResponse: (request, response, data, message) => {
        response.json(
            {
                status: 200,
                result: data,
                message: message,
                debug: null
            }
        );
    },
    sendError: (request, response, status, error) => {
        response
            .status(status)
            .type("application/problem+json")
            .json(
                {
                    type: error.type,
                    title: error.title,
                    status: status,
                    details: error.details,
                    instance: request.originalUrl
                }
            );
    }
};

module.exports = WebApiController;