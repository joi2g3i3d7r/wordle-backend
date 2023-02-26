import supertest from 'supertest';
import appServer from '../src/app';

let accessToken: string;

beforeEach(async () => {

  const responseNewUser = await supertest(appServer)
    .post('/api/users')
    .set('Content-type', 'application/json')
    .send({
      username: 'user-testing',
      grant: 'USER_GAME'
    });

  accessToken = responseNewUser.body.accessToken;

  console.log({accessToken: responseNewUser.body});
})


it('Generate new word', async () => {

  const response = await supertest(appServer)
    .get('/api/unique-word')
    .set('Content-type', 'application/json')
    .set('access-token', 'Bearer ' + accessToken)
    .send();

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('wordId');
  expect(response.body).toHaveProperty('word');
})
