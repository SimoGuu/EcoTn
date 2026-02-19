const request = require('supertest');
const express = require('express');
const Consumption = require('../app/models/consumption');
const Production = require('../app/models/production');
const House = require('../app/models/house');
const houseController = require('../app/controllers/houseController');
const houseRoutes = require('../app/routes/houseRoutes');

jest.mock('../app/models/house');
jest.mock('../app/models/production'); 
jest.mock('../app/models/consumption')

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
    jest.restoreAllMocks();
  });

  it('Dovrebbe restituire medie orarie se start == end', async () => {
    const mockData = [
      { _id: 8, media: 0.45 },
      { _id: 9, media: 0.60 }
    ];
    
    const spy = jest.spyOn(Consumption, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/houses/${houseId}/consumption-stats`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toEqual([8, 9]);
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
    expect(res.body.labels).toEqual(['2023-10-25', '2023-10-26']);
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

describe('houseController.getLatestBatteryLevel', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '65a1234567890abcdef12345' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it('dovrebbe restituire 200 e il livello batteria se i dati esistono', async () => {
    const mockData = {
      lv_batteria: 85,
      data_ora: new Date(),
    };

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(mockData),
    };

    Production.findOne.mockReturnValue(mockQuery);

    await houseController.getLatestBatteryLevel(req, res);

    expect(Production.findOne).toHaveBeenCalledWith({ 
      house: req.params.id, 
      lv_batteria: { $exists: true, $ne: null } 
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      lv_batteria: 85
    });
  });

  it('dovrebbe restituire 404 se non vengono trovati dati per quella casa', async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(null),
    };

    Production.findOne.mockReturnValue(mockQuery);

    await houseController.getLatestBatteryLevel(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it('dovrebbe restituire 500 in caso di errore del database', async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockRejectedValue(new Error('DB Error')),
    };

    Production.findOne.mockReturnValue(mockQuery);

    await houseController.getLatestBatteryLevel(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'DB Error' })
    );
  });
});