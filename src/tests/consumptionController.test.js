const consumptionController = require("../app/controllers/consumptionController");
const Consumption = require("../app/models/consumption");

jest.mock("../app/models/consumption");

describe("Consumption Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // =========================
  // getConsumptions
  // =========================
  test("getConsumptions - restituisce lista consumi", async () => {
    Consumption.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ value: 100 }])
    });

    await consumptionController.getConsumptions(req, res);

    expect(res.json).toHaveBeenCalledWith([{ value: 100 }]);
  });

  test("getConsumptions - errore database", async () => {
    Consumption.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error"))
    });

    await consumptionController.getConsumptions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });

  // =========================
  // createConsumption
  // =========================
  test("createConsumption - creazione riuscita", async () => {
  req.body = { value: 200 };

  const mockConsumption = {
    value: 200,
    save: jest.fn().mockResolvedValue(true)
  };

  Consumption.mockImplementation(() => mockConsumption);

  await consumptionController.createConsumption(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(mockConsumption);
});


  test("createConsumption - errore validazione", async () => {
    req.body = { value: 200 };
    Consumption.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Validation error"))
    }));

    await consumptionController.createConsumption(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
  });

  // =========================
  // getConsumptionById
  // =========================
  test("getConsumptionById - consumo trovato", async () => {
    req.params.id = "123";
    Consumption.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ value: 150 }])
    });

    await consumptionController.getConsumptionById(req, res);

    expect(res.json).toHaveBeenCalledWith([{ value: 150 }]);
  });

  test("getConsumptionById - consumo non trovato", async () => {
    req.params.id = "123";
    Consumption.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });

    await consumptionController.getConsumptionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Consumption not found" });
  });

  test("getConsumptionById - errore database", async () => {
    req.params.id = "123";
    Consumption.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error"))
    });

    await consumptionController.getConsumptionById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });

  // =========================
  // updateConsumption
  // =========================
  test("updateConsumption - aggiornamento riuscito", async () => {
    req.params.id = "123";
    req.body = { value: 300 };
    Consumption.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ value: 300 })
    });

    await consumptionController.updateConsumption(req, res);

    expect(res.json).toHaveBeenCalledWith({ value: 300 });
  });

  test("updateConsumption - consumo non trovato", async () => {
    req.params.id = "123";
    req.body = { value: 300 };
    Consumption.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await consumptionController.updateConsumption(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Consumption not found" });
  });

  test("updateConsumption - errore validazione", async () => {
    req.params.id = "123";
    req.body = { value: 300 };
    Consumption.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Validation error"))
    });

    await consumptionController.updateConsumption(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
  });

  // =========================
  // deleteConsumption
  // =========================
  test("deleteConsumption - eliminazione riuscita", async () => {
    req.params.id = "123";
    Consumption.findByIdAndDelete.mockResolvedValue({});

    await consumptionController.deleteConsumption(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Consumption deleted" });
  });

  test("deleteConsumption - consumo non trovato", async () => {
    req.params.id = "123";
    Consumption.findByIdAndDelete.mockResolvedValue(null);

    await consumptionController.deleteConsumption(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Consumption not found" });
  });

  test("deleteConsumption - errore database", async () => {
    req.params.id = "123";
    Consumption.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await consumptionController.deleteConsumption(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });
});
