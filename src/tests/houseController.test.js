const request = require('supertest');
const express = require('express');
const Consumption = require('../app/models/consumption');
const Production = require('../app/models/production');
const House = require('../app/models/house');
const houseController = require('../app/controllers/houseController');
const houseRoutes = require('../app/routes/houseRoutes');

jest.mock('../app/models/house');

const app = express();
app.use(express.json());
app.use('/api/v1/houses', houseRoutes);


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

describe('House Consumption Stats (Mocked)', () => {
  const houseId = '69938ad61a8406ee0407f368';

  afterEach(() => {
    jest.restoreAllMocks(); // Previene il leak dei mock tra i test
  });

  it('Dovrebbe restituire medie orarie se start == end', async () => {
    const mockData = [
      { _id: 8, media: 0.45 },
      { _id: 9, media: 0.60 }
    ];
    // Mockiamo il metodo aggregate del modello Consumption
    const spy = jest.spyOn(Consumption, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/consumption-stats`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toEqual([8, 9]); // Raggruppamento orario ($hour)
    expect(res.body.values).toEqual([0.45, 0.60]);
    spy.mockRestore();
  });

  it('Dovrebbe restituire medie giornaliere se start != end', async () => {
    const mockData = [
      { _id: '2023-10-25', media: 1.2 },
      { _id: '2023-10-26', media: 1.5 }
    ];
    const spy = jest.spyOn(Consumption, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/consumption-stats`)
      .query({ start: '2023-10-25', end: '2023-10-26' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toEqual(['2023-10-25', '2023-10-26']); // Formato %Y-%m-%d
    spy.mockRestore();
  });

  it('Dovrebbe restituire 500 in caso di errore del database', async () => {
    jest.spyOn(Consumption, 'aggregate').mockRejectedValue(new Error('DB Fail'));

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/consumption-stats`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB Fail');
  });
});

describe('House Production Stats (Mocked)', () => {
  const houseId = '69938ad61a8406ee0407f368';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Dovrebbe calcolare correttamente le medie orarie della produzione', async () => {
    const mockData = [{ _id: 12, media: 4.2 }];
    const spy = jest.spyOn(Production, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/production-stats`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toContain(12);
    expect(res.body.values).toContain(4.2);
    spy.mockRestore();
  });

  it('Dovrebbe gestire gli errori di aggregazione produzione', async () => {
    jest.spyOn(Production, 'aggregate').mockRejectedValue(new Error('Aggregate Error'));

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/production-stats`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Aggregate Error');
  });
});