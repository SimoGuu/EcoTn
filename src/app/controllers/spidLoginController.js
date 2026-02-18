const WebApiController = require("./index");
const {response} = require("express");

const SpidLoginController = {
    config: {
        baseUrl: "https://aanmelden.altervista.org/spid/",
        clientId: "1636faf6-042b-11f1-a8c5-04421a23da50",
        clientSecret: "ce0b0c4edcc25441e87a2babf799ae87",
        redirectUri: (process.env.DEPLOY_MODE === "development")
            ? "http://localhost:8080/api/v1/spid/callback"
            : "https://ecotn-5fc1.onrender.com/api/v1/spid/callback",
        endpoints: {
            authorize: "authorize.php",
            token: "token.php",
            scope: "scope/attributes.spid.gov.it/*"
        },
        scope: [
            "https://attributes.spid.gov.it/spidCode",
            "https://attributes.spid.gov.it/name",
            "https://attributes.spid.gov.it/familyName",
            "https://attributes.spid.gov.it/fiscalNumber",
            "https://attributes.spid.gov.it/domicileStreetAddress",
            "https://attributes.spid.gov.it/address",
            "https://attributes.spid.gov.it/domicilePostalCode",
            "https://attributes.spid.gov.it/domicileMunicipality",
            "https://attributes.spid.gov.it/domicileProvince",
            "https://attributes.spid.gov.it/domicileNation"
        ],
        validDomicileMunicipality: "L378"
    },
    doLogin: (request, response) => {
        response.redirect(
            SpidLoginController.config.baseUrl + SpidLoginController.config.endpoints.authorize +
            "?response_type=code&client_id=" +
            SpidLoginController.config.clientId + "&scope=" +
            SpidLoginController.config.scope.join(" ") +
            "&redirect_uri=" + SpidLoginController.config.redirectUri +
            "&access_type=offline"
        );
    },
    negotiateUserToken: async (code) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(
                    SpidLoginController.config.baseUrl + SpidLoginController.config.endpoints.token,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            grant_type: "authorization_code",
                            code: code,
                            redirect_uri: SpidLoginController.config.redirectUri,
                            client_id: SpidLoginController.config.clientId,
                            client_secret: SpidLoginController.config.clientSecret
                        })
                    }
                );

                let data = await response.json();
                resolve(data["access_token"]);
            } catch (error) {
                resolve(null);
            }
        });
    },
    getUserScopes: async (accessToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(
                    SpidLoginController.config.baseUrl + SpidLoginController.config.endpoints.scope,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + accessToken
                        }
                    }
                );

                let data = await response.json();
                resolve(data["result"]["attributes.spid.gov.it"]);
            } catch (error) {
                resolve(null);
            }
        });
    },
    handleCallback: async (request, response) => {
        if (Object.keys(request.session).includes("SPIDToken")) {
            delete request.session["SPIDToken"];
        }

        if (!(Object.keys(request.query).includes("code"))) {
            WebApiController.sendError(request, response, 400, {
                type: "bad-request",
                title: "Bad request",
                status: 400,
                details: "The request is invalid or in a bad format."
            });
        } else {
            let code = request.query["code"];
            let userSpidAccessToken = await SpidLoginController.negotiateUserToken(code);

            if (userSpidAccessToken == null) {
                WebApiController.sendError(request, response, 400, {
                    type: "unauthorized",
                    title: "Unauthorized",
                    status: 401,
                    details: "The authorization server has rejected the request."
                });
            } else {
                request.session["SPIDToken"] = userSpidAccessToken;

                let userSpidScopes = await SpidLoginController.getUserScopes(userSpidAccessToken);
                if (userSpidScopes != null) {
                    if (userSpidScopes["domicileMunicipality"] === SpidLoginController.config.validDomicileMunicipality) {
                        /*
                        WebApiController.sendResponse(
                            request,
                            response,
                            {
                                "scope": userSpidScopes,
                                "access_token": userSpidAccessToken
                            },
                            ""
                        );
                         */

                        response.redirect(
                            (process.env.DEPLOY_MODE === "development")
                                ? "http://localhost:5500/public/index.html"
                                : "https://ecotn-frontend.onrender.com/index.html"
                        );
                    } else {
                        WebApiController.sendError(request, response, 422, {
                            type: "unprocessable-entity",
                            title: "Unprocessable Entity",
                            status: 422,
                            details: "The current user is not resident in the City of Trento."
                        });
                    }
                } else {
                    WebApiController.sendError(request, response, 400, {
                        type: "unprocessable-entity",
                        title: "Unprocessable Entity",
                        status: 422,
                        details: "The authorization server has rejected the provided entity."
                    });
                }
            }
        }
    }
};

module.exports = SpidLoginController;
