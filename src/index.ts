import server from './app';
import PostgresDataSource from './database/datasource';
import { wordSeed } from './database/seeding/word.seed';

const connectDB = async () => {
  try {
    await PostgresDataSource.initialize();
    console.log('Data Source has been initialized');
    await wordSeed()
    console.log('Seeds complete successfully');
  } catch (error) {
    console.error('Error during Data Source initialization', error)
  }
}

server.listen(server.get('port'), () => {
  connectDB();
  console.log(`Server listening on http://localhost:${server.get('port')}`);
})
