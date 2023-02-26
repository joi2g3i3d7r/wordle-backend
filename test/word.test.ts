import supertest from 'supertest';
import appServer from '../src/app';

let accessToken: string;

beforeEach(async () => {
  const responseNewUser = await supertest(appServer)
    .post('/api/users')
    .set('Content-type', 'application/json')
    .send({
      username: 'user-testing-1',
      grant: 'USER_GAME'
    });

  accessToken = responseNewUser.body.accessToken;
})

describe('GET /api/game/word', () => {
  test('Generate new word', async () => {
    const response = await supertest(appServer)
      .get('/api/game/word')
      .set('Content-type', 'application/json')
      .set('access-token', 'Bearer ' + accessToken)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('wordId');
    expect(response.body).toHaveProperty('word');
  })
})

describe('PUT /api/game/word', () => {

  beforeEach(async () => {
    await supertest(appServer)
      .get('/api/game/word')
      .set('Content-type', 'application/json')
      .set('access-token', 'Bearer ' + accessToken)
      .send();
  })

  test('Validate word', async () => {
    const response = await supertest(appServer)
      .put('/api/game/word')
      .set('Content-type', 'application/json')
      .set('access-token', 'Bearer ' + accessToken)
      .send({
        'user_word': 'CLAIM'
      });

    expect(response.statusCode).toBe(200);
    expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    expect(Array.isArray(response.body)).toBe(true);
  })
})
