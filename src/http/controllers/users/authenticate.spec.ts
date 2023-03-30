import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('Should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John doe',
      email: 'johndoe@example.com',
      password: '123456789',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456789',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
