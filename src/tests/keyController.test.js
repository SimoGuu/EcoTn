jest.mock("../app/models/key");

const Key = require("../app/models/key");
const keyController = require("../app/controllers/keyController");

describe("Key Controller", () => {

  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      body: { name: "Test Key" }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe("getKeys", () => {

    it("should return keys successfully", async () => {
      const mockKeys = [{ name: "Key1" }];
      Key.find.mockResolvedValue(mockKeys);

      await keyController.getKeys(req, res);

      expect(Key.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockKeys);
    });

    it("should return 500 if error occurs", async () => {
      Key.find.mockRejectedValue(new Error("DB error"));

      await keyController.getKeys(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });

  });

  describe("createKey", () => {

    it("should create key successfully", async () => {
      const saveMock = jest.fn().mockResolvedValue();
      Key.mockImplementation(() => ({
        save: saveMock
      }));

      await keyController.createKey(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if save fails", async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error("Validation error"));
      Key.mockImplementation(() => ({
        save: saveMock
      }));

      await keyController.createKey(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
    });

  });

});
