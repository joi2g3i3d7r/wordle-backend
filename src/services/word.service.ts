import PostgresDataSource from "../database/datasource";
import UserWordCurrent from "../entities/user-word-current.entity";
import UserWordTrace from "../entities/user-word-trace.entity";
import Word from "../entities/word.entity";
import IUniqueWord from "../interfaces/uniqueWord.interface";

const getValue = (inputLetter: string, currentLetter: string, existsLetter: boolean): number => {
  if (!existsLetter)
    return 3

  if (currentLetter !== inputLetter)
    return 2

  return 1
}

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

export const validateWordByUser = async (userWord: string, userId: string) => {
  try {
    const currentUserWordRecord: UserWordCurrent = await PostgresDataSource
      .getRepository(UserWordCurrent)
      .findOne({
        where: {
          userId,
        },
      })

    const currentWordRecord: Word = await PostgresDataSource
      .getRepository(Word)
      .findOne({
        where: {
          id: currentUserWordRecord.wordId,
        }
      });

    const userWordTraceRecord: UserWordTrace = await PostgresDataSource
      .getRepository(UserWordTrace)
      .findOne({
        where: {
          userId,
          wordId: currentWordRecord.id
        }
      });

    if (userWordTraceRecord.guess) {
      return {
        ok: false,
        msg: 'Ya logró acertar esta palabra, elija una nueva'
      }
    }

    if (userWordTraceRecord.tries >= 5) {
      return {
        ok: false,
        msg: 'Se acabaron sus intentos'
      }
    }

    const currentWordSplit = currentWordRecord.word.toLowerCase().split('');
    const userWordSplit = userWord.toLowerCase().split('');

    const resultLetters = userWordSplit.map((inputLetter, index) => {
      const currentLetter: string = currentWordSplit[index];
      const existsLetter: boolean = currentWordSplit.some(row => row === inputLetter);

      return {
        letter: userWord[index],
        value: getValue(inputLetter, currentLetter, existsLetter)
      }
    });

    const guess = resultLetters.every(row => row.value === 1);

    await PostgresDataSource
      .createQueryBuilder()
      .update(UserWordTrace)
      .set({ tries: () => 'tries + 1', guess })
      .where('userId = :userId', { userId })
      .andWhere('wordId = :wordId', { wordId: currentWordRecord.id })
      .execute();

    return {
      ok: true,
      resultLetters
    };
  } catch (error) {
    throw error
  }
}
