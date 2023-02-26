import appServer from './src/app';
import PostgresDataSource from './src/database/datasource';

let server, database;

beforeAll(async () => {
  server = appServer.listen();
  database = await PostgresDataSource.initialize();
})

afterAll(async () => {
  server.close();
  database.destroy();
})
