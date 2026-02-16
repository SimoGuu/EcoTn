const houseController = require("../../app/controllers/houseController");
const House = require("../../app/models/house");

jest.mock("../../app/models/house");

describe("House Controller", () => {

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
  // getHouses
  // =========================

  test("getHouses - restituisce lista case", async () => {
    House.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ address: "Via Roma" }])
    });

    await houseController.getHouses(req, res);

    expect(res.json).toHaveBeenCalledWith([{ address: "Via Roma" }]);
  });

  test("getHouses - errore database", async () => {
    House.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await houseController.getHouses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // =========================
  // createHouse
  // =========================

  test("createHouse - creazione riuscita", async () => {
    req.body = { address: "Via Milano" };

    House.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ address: "Via Milano" })
    }));

    await houseController.createHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("createHouse - errore validazione", async () => {
    House.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Validation error"))
    }));

    await houseController.createHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // =========================
  // getHouseById
  // =========================

  test("getHouseById - casa trovata", async () => {
    req.params.id = "123";

    House.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ address: "Via Roma" })
    });

    await houseController.getHouseById(req, res);

    expect(res.json).toHaveBeenCalledWith({ address: "Via Roma" });
  });

  test("getHouseById - casa non trovata", async () => {
    req.params.id = "123";

    House.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await houseController.getHouseById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================
  // updateHouse
  // =========================

  test("updateHouse - aggiornamento riuscito", async () => {
    req.params.id = "123";
    req.body = { address: "Via Napoli" };

    House.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ address: "Via Napoli" })
    });

    await houseController.updateHouse(req, res);

    expect(res.json).toHaveBeenCalledWith({ address: "Via Napoli" });
  });

  test("updateHouse - casa non trovata", async () => {
    req.params.id = "123";

    House.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await houseController.updateHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================
  // deleteHouse
  // =========================

  test("deleteHouse - eliminazione riuscita", async () => {
    req.params.id = "123";

    House.findByIdAndDelete.mockResolvedValue({});

    await houseController.deleteHouse(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "House deleted" });
  });

  test("deleteHouse - casa non trovata", async () => {
    req.params.id = "123";

    House.findByIdAndDelete.mockResolvedValue(null);

    await houseController.deleteHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});
