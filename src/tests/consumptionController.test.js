const request = require('supertest');
const express = require('express');
const Consumption = require('../app/models/consumption');
const consumptionRoutes = require('../app/routes/consumptionRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/consumptions', consumptionRoutes);

describe('Test Suite Consumi (Mocked)', () => {
  const houseId = '69938ad61a8406ee0407f368';

  // SCENARIO 1: Media per ORA (start == end)
  it('Dovrebbe raggruppare per ORA quando start e end coincidono', async () => {
    const mockData = [
      { _id: 10, media: 0.5 },
      { _id: 11, media: 0.8 }
    ];
    const spy = jest.spyOn(Consumption, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/consumptions/stats/${houseId}`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toEqual([10, 11]);
    expect(res.body.values).toEqual([0.5, 0.8]);
    spy.mockRestore();
  });

  // SCENARIO 2: Media per GIORNO (start != end)
  it('Dovrebbe raggruppare per GIORNO quando le date sono diverse', async () => {
    const mockData = [
      { _id: '2023-10-25', media: 1.2 },
      { _id: '2023-10-26', media: 1.5 }
    ];
    const spy = jest.spyOn(Consumption, 'aggregate').mockResolvedValue(mockData);

    const res = await request(app)
      .get(`/api/v1/consumptions/stats/${houseId}`)
      .query({ start: '2023-10-25', end: '2023-10-26' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toEqual(['2023-10-25', '2023-10-26']);
    spy.mockRestore();
  });

  // SCENARIO 3: Eventuale FAIL (Errore 500)
  it('Dovrebbe restituire 500 se il database fallisce', async () => {
    const spy = jest.spyOn(Consumption, 'aggregate').mockRejectedValue(new Error('DB Error'));

    const res = await request(app)
      .get(`/api/v1/consumptions/stats/${houseId}`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'DB Error');
    spy.mockRestore();
  });
});