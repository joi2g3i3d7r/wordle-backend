import PostgresDataSource from "../database/datasource";
import UserWordCurrent from "../entities/user-word-current.entity";
import UserWordTrace from "../entities/user-word-trace.entity";
import Word from "../entities/word.entity";
import IUniqueWord from "../interfaces/uniqueWord.interface";

export const generateUniqueWordByUser = async (userId: string): Promise<IUniqueWord> => {
  const userWordTraceList: UserWordTrace[] = await PostgresDataSource
    .getRepository(UserWordTrace)
    .find({
      where: {
        userId
      }
    })

  const wordIdListUsed: number[] = userWordTraceList.map((userWord: UserWordTrace) => userWord.wordId);

  const wordList: Word[] = await PostgresDataSource
    .getRepository(Word)
    .createQueryBuilder()
    .where('LENGTH(word) = :length', { length: 5 })
    .andWhere(wordIdListUsed.length > 0 ? 'id NOT IN (:...ids)' : '1=1', { ids: wordIdListUsed })
    .getMany();

  const userWordCurrentRecord = await PostgresDataSource
    .getRepository(UserWordCurrent)
    .findOne({
      where: {
        userId,
      }
    })

  const randomIndex: number = Math.floor(Math.random() * wordList.length);
  const randomWordRecord: Word = wordList[randomIndex];

  const queryRunner = PostgresDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(UserWordTrace)
      .values({
        userId,
        wordId: randomWordRecord.id,
        tries: 0,
        guess: false,
      })
      .execute();

    if (userWordCurrentRecord) {
      await queryRunner.manager
        .createQueryBuilder()
        .update(UserWordCurrent)
        .set({
          wordId: randomWordRecord.id
        })
        .where('userId = :userId', { userId })
        .execute();
    } else {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(UserWordCurrent)
        .values({
          userId,
          wordId: randomWordRecord.id,
        })
        .execute();
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }

  return {
    wordId: randomWordRecord.id,
    word: randomWordRecord.word,
  };
}
