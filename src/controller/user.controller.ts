import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JsonWebToken } from "../config";
import PostgresDataSource from "../database/datasource";
import Users from "../entities/user.entity";
import ICreateUserRequest from "../interfaces/createUserRequest.interface";
import IUserPayload from "../interfaces/userPayload.interface";
import { UserGrantType } from "../types/userGrant.types";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const createUserReq: ICreateUserRequest = req.body;

    const newUser = new Users();
    newUser.username = createUserReq.username;
    newUser.grant = createUserReq.grant;

    const newUserSaved: Users = await PostgresDataSource.getRepository(Users).save(newUser);

    const payload: IUserPayload = {
      userId: newUserSaved.id,
      grant: (newUserSaved.grant as UserGrantType),
    }

    const token = jwt.sign(payload, JsonWebToken.secretKey, {
      expiresIn: '1h',
    });

    res.status(201).send({
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}
