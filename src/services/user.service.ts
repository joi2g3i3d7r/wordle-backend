import jwt from 'jsonwebtoken';
import { JsonWebToken } from "../config";
import PostgresDataSource from "../database/datasource";
import User from "../entities/user.entity";
import ICreateUserRequest from "../interfaces/createUserRequest.interface";
import IUserPayload from "../interfaces/userPayload.interface";
import { UserGrantType } from "../types/userGrant.types";

export const createNewUser = async (createUserReq: ICreateUserRequest): Promise<string> => {
  const newUser = new User();
  newUser.username = createUserReq.username;
  newUser.grant = createUserReq.grant;

  const newUserSaved: User = await PostgresDataSource.getRepository(User).save(newUser);

  const payload: IUserPayload = {
    userId: newUserSaved.id,
    grant: (newUserSaved.grant as UserGrantType),
  }

  const token = jwt.sign(payload, JsonWebToken.secretKey, {
    expiresIn: '1h',
  });

  return token;
}
