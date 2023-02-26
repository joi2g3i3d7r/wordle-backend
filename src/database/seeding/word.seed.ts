import https from 'https';
import Words from '../../entities/word.entity';
import PostgresDataSource from '../datasource';

export const wordSeed = async () => {
  const wordList: Words[] = await PostgresDataSource
    .getRepository(Words)
    .createQueryBuilder()
    .take(10)
    .getMany();

  if (wordList.length === 0) {
    const req = https.get('https://gitlab.com/d2945/words/-/raw/main/words.txt', (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      })

      res.on('end', async () => {
        const words = result
          .split('\n')
          .map((word) => ({ word }))

        const batchSize = 500; // cantidad de registros por lote

        for (let index = 0; index < words.length; index += batchSize) {
          const batch = words.slice(index, index + batchSize);

          await PostgresDataSource.transaction(async (entityManager) => {
            await entityManager
              .createQueryBuilder()
              .insert()
              .into(Words)
              .values(batch)
              .execute();
          });
        }
      })
    });

    req.on('error', (err) => {
      console.log('An error has ocurred seeding words', err);
    });

    req.end();
  }
}
