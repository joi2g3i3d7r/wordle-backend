import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import PostgresDataSource from "../database/datasource";
import UserWordCurrent from "../entities/user-word-current.entity";
import UserWordTrace from "../entities/user-word-trace.entity";
import Word from "../entities/word.entity";
import IUniqueWord from "../interfaces/uniqueWord.interface";
import IUserPayload from "../interfaces/userPayload.interface";
import { generateUniqueWordByUser } from "../services/word.service";

const getValue = (inputLetter: string, currentLetter: string, existsLetter: boolean) => {
  if (!existsLetter)
    return 3

  if (currentLetter !== inputLetter)
    return 2

  return 1
}

export const getWordsHandler = async (req: Request, res: Response) => {
  try {

    const wordList: Word[] = await PostgresDataSource
      .getRepository(Word)
      .createQueryBuilder()
      .where('LENGTH(word) = 5')
      .getMany();

    res.status(200).send({
      wordList,
    });
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}

export const getUniqueWordHandler = async (req: Request, res: Response) => {
  try {
    const bearerToken: string = req.headers['access-token'] as string;
    const accessToken = bearerToken.replace('Bearer ', '');
    const payload: IUserPayload = jwt.decode(accessToken) as IUserPayload;
    const uniqueWord: IUniqueWord = await generateUniqueWordByUser(payload.userId);
    res.status(200).send(uniqueWord);
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}

export const validateWordHandler = async (req: Request, res: Response) => {
  try {
    const bearerToken: string = req.headers['access-token'] as string;
    const accessToken = bearerToken.replace('Bearer ', '');
    const payload: IUserPayload = jwt.decode(accessToken) as IUserPayload;
    const userWord: string = req.body.user_word;

    const currentUserWordRecord: UserWordCurrent = await PostgresDataSource
      .getRepository(UserWordCurrent)
      .findOne({
        where: {
          userId: payload.userId,
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
          userId: payload.userId,
          wordId: currentWordRecord.id
        }
      });

    if (userWordTraceRecord.guess) {
      return res.status(409).send('Ya logró acertar esta palabra, elija una nueva');
    }

    if (userWordTraceRecord.tries >= 5) {
      return res.status(409).send('Se acabaron sus intentos');
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
      .where('userId = :userId', { userId: payload.userId })
      .andWhere('wordId = :wordId', { wordId: currentWordRecord.id })
      .execute();

    res.status(200).send(resultLetters);
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}
