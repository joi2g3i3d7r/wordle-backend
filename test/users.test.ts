import supertest from 'supertest';
import appServer from '../src/app';

it('Create a new user for game', async () => {
  const payload = {
    username: 'Blanda',
    grant: 'USER_GAME'
  }

  const response = await supertest(appServer)
    .post('/api/users')
    .set('Content-type', 'application/json')
    .send(payload);

  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('accessToken');
})
