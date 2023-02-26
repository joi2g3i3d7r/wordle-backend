import { Request, Response } from "express";
import ICreateUserRequest from "../interfaces/createUserRequest.interface";
import { createNewUser } from "../services/user.service";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const createUserReq: ICreateUserRequest = req.body;

    const accessToken = await createNewUser(createUserReq);

    res.status(201).send({
      accessToken,
    });
  } catch (error) {
    res.status(500).send({
      error: `${error}`
    });
  }
}
