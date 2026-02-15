const productionController = require("../../app/controllers/productionController");
const Production = require("../../app/models/production");

jest.mock("../../app/models/production");

describe("Production Controller", () => {

  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  // =========================
  // getProductions
  // =========================

  test("getProductions - restituisce lista produzioni", async () => {
    Production.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ value: 500 }])
    });

    await productionController.getProductions(req, res);

    expect(res.json).toHaveBeenCalledWith([{ value: 500 }]);
  });

  test("getProductions - errore database", async () => {
    Production.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await productionController.getProductions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // =========================
  // createProduction
  // =========================

  test("createProduction - creazione riuscita", async () => {
    req.body = { value: 300 };

    Production.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ value: 300 })
    }));

    await productionController.createProduction(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createProduction - errore validazione", async () => {
    Production.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Validation error"))
    }));

    await productionController.createProduction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});
