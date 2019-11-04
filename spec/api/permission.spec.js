const request = require('supertest');
const app = require('../../server/web-server');

const path = '/api/v1/permission';

describe('permissions apis', () => {
  it('should fail when reading permissions when no pagination', async () => {
    const res = await request(app).get(path);
    expect(res.status).toBe(422);
  });

  it('should return total zero and empty data', async () => {
    const res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 1 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});
