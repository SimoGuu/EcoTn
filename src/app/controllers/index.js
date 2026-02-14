const WebApiController = {
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