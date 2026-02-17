const SpidLoginController = require("../app/controllers/spidLoginController");
const WebApiController = require("../app/controllers/index");

global.fetch = jest.fn();

jest.mock("../app/controllers/index", () => ({
    sendError: jest.fn(),
    sendResponse: jest.fn()
}));

describe("SpidLoginController", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------------------------------
    // doLogin
    // -------------------------------------------------
    describe("doLogin", () => {
        it("should redirect to SPID authorization endpoint", () => {
            const mockResponse = {
                redirect: jest.fn()
            };

            SpidLoginController.doLogin({}, mockResponse);

            expect(mockResponse.redirect).toHaveBeenCalledTimes(1);

            const redirectUrl = mockResponse.redirect.mock.calls[0][0];

            expect(redirectUrl).toContain("authorize.php");
            expect(redirectUrl).toContain("response_type=code");
            expect(redirectUrl).toContain("client_id=");
        });
    });

    // -------------------------------------------------
    // negotiateUserToken
    // -------------------------------------------------
    describe("negotiateUserToken", () => {

        it("should return access_token when fetch succeeds", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    access_token: "mocked_token"
                })
            });

            const result = await SpidLoginController.negotiateUserToken("code123");

            expect(result).toBe("mocked_token");
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("should return null if fetch throws error", async () => {
            fetch.mockRejectedValue(new Error("network error"));

            const result = await SpidLoginController.negotiateUserToken("code123");

            expect(result).toBeNull();
        });
    });

    // -------------------------------------------------
    // getUserScopes
    // -------------------------------------------------
    describe("getUserScopes", () => {

        it("should return user scopes on success", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    result: {
                        "attributes.spid.gov.it": {
                            domicileMunicipality: "L378"
                        }
                    }
                })
            });

            const result = await SpidLoginController.getUserScopes("token");

            expect(result).toEqual({
                domicileMunicipality: "L378"
            });
        });

        it("should return null if fetch fails", async () => {
            fetch.mockRejectedValue(new Error("error"));

            const result = await SpidLoginController.getUserScopes("token");

            expect(result).toBeNull();
        });
    });

    // -------------------------------------------------
// handleCallback
// -------------------------------------------------
describe("handleCallback", () => {

    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
            session: {},
            query: {}
        };

        mockResponse = {
            redirect: jest.fn()
        };
    });

    it("should return 400 if code is missing", async () => {
        await SpidLoginController.handleCallback(mockRequest, mockResponse);

        expect(WebApiController.sendError).toHaveBeenCalledWith(
            mockRequest,
            mockResponse,
            400,
            expect.objectContaining({
                type: "bad-request"
            })
        );
    });

    it("should return unauthorized if token negotiation fails", async () => {
        mockRequest.query.code = "abc";

        jest.spyOn(SpidLoginController, "negotiateUserToken")
            .mockResolvedValue(null);

        await SpidLoginController.handleCallback(mockRequest, mockResponse);

        expect(WebApiController.sendError).toHaveBeenCalledWith(
            mockRequest,
            mockResponse,
            400,
            expect.objectContaining({
                type: "unauthorized"
            })
        );
    });

    it("should return 422 if domicileMunicipality is invalid", async () => {
        mockRequest.query.code = "abc";

        jest.spyOn(SpidLoginController, "negotiateUserToken")
            .mockResolvedValue("valid_token");

        jest.spyOn(SpidLoginController, "getUserScopes")
            .mockResolvedValue({
                domicileMunicipality: "WRONG"
            });

        await SpidLoginController.handleCallback(mockRequest, mockResponse);

        expect(WebApiController.sendError).toHaveBeenCalledWith(
            mockRequest,
            mockResponse,
            422,
            expect.objectContaining({
                type: "unprocessable-entity"
            })
        );
    });

    it("should redirect if everything is valid", async () => {
        mockRequest.query.code = "abc";

        jest.spyOn(SpidLoginController, "negotiateUserToken")
            .mockResolvedValue("valid_token");

        jest.spyOn(SpidLoginController, "getUserScopes")
            .mockResolvedValue({
                domicileMunicipality: "L378"
            });

        await SpidLoginController.handleCallback(mockRequest, mockResponse);

        // token salvato in sessione
        expect(mockRequest.session["SPIDToken"]).toBe("valid_token");

        // verifica redirect (QUESTO è quello giusto)
        expect(mockResponse.redirect).toHaveBeenCalledWith(
            "http://localhost:5500/public/index.html"
        );
    });

    it("should return error if getUserScopes returns null", async () => {
        mockRequest.query.code = "abc";

        jest.spyOn(SpidLoginController, "negotiateUserToken")
            .mockResolvedValue("valid_token");

        jest.spyOn(SpidLoginController, "getUserScopes")
            .mockResolvedValue(null);

        await SpidLoginController.handleCallback(mockRequest, mockResponse);

        expect(WebApiController.sendError).toHaveBeenCalled();
        });
    });
});
