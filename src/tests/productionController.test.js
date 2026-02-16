const request = require('supertest');
const express = require('express');
const Production = require('../app/models/production');
const productionRoutes = require('../app/routes/productionRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/productions', productionRoutes);

describe('Test Suite Produzione (Mocked)', () => {
  const houseId = '69938ad61a8406ee0407f368';

  it('Dovrebbe gestire correttamente il raggruppamento orario della produzione', async () => {
    const spy = jest.spyOn(Production, 'aggregate').mockResolvedValue([
      { _id: 12, media: 3.5 }
    ]);

    const res = await request(app)
      .get(`/api/v1/productions/stats/${houseId}`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toContain(12);
    spy.mockRestore();
  });

  it('Dovrebbe fallire correttamente in caso di errore aggregate', async () => {
    const spy = jest.spyOn(Production, 'aggregate').mockRejectedValue(new Error('Connection Lost'));

    const res = await request(app)
      .get(`/api/v1/productions/stats/${houseId}`)
      .query({ start: '2023-10-27', end: '2023-10-27' });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Connection Lost');
    spy.mockRestore();
  });
});