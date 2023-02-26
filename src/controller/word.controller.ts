import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import IUniqueWord from "../interfaces/uniqueWord.interface";
import IUserPayload from "../interfaces/userPayload.interface";
import { generateUniqueWordByUser, validateWordByUser } from "../services/word.service";

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

    const validationWord = await validateWordByUser(userWord, payload.userId);

    if (!validationWord.ok) {
      return res.status(409).send(validationWord.msg);
    }

    res.status(200).send(validationWord.resultLetters);
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}
