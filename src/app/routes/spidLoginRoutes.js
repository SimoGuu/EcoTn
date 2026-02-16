const express = require('express');
const router = express.Router();

const WebApiController = require('../controllers/index');
const SpidLoginController = require('../controllers/spidLoginController');

router.get("/login", async (request, response) => {
    if (Object.keys(request.session).includes("SPIDToken")) {
        let spidToken = request.session["SPIDToken"];
        let spidUserScopes = await SpidLoginController.getUserScopes(spidToken);

        if (spidUserScopes != null) {
            if (spidUserScopes["domicileMunicipality"] === SpidLoginController.config.validDomicileMunicipality) {
                WebApiController.sendResponse(request, response, spidUserScopes, "");
            } else {
                delete request.session["SPIDToken"];

                WebApiController.sendError(request, response, 422, {
                    type: "unprocessable-entity",
                    title: "Unprocessable Entity",
                    status: 422,
                    details: "The current user is not resident in the City of Trento."
                });
            }
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

router.get("/logout", (request, response) => {
    delete request.session["SPIDToken"];
    WebApiController.sendResponse(request, response, null, "");
});

router.get("/callback", async (request, response) => {
    await SpidLoginController.handleCallback(request, response);
});

router.get("/session", (request, response) => {
    WebApiController.sendResponse(request, response, request.session, "");
});

module.exports = router;