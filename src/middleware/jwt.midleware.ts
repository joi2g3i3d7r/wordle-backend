import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JsonWebToken } from '../config';
import IUserPayload from '../interfaces/userPayload.interface';
import { UserGrantType } from '../types/userGrant.types';

export const validateRoleMiddleware = (role: UserGrantType) => async (req: Request, res: Response, next: NextFunction) => {

  const tokenHeader = req.headers['access-token'] as string;

  if (!tokenHeader) {
    return res.status(401).send('Token not found');
  }

  const token = tokenHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Invalid token format');
  }

  try {
    const payload = jwt.verify(token, JsonWebToken.secretKey) as IUserPayload;

    if (payload.grant !== role) {
      return res.status(403).send('Recurso no disponible');
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Error on verify token');
  }
}

