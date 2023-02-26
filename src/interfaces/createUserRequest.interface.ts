import { UserGrantType } from "../types/userGrant.types";

export default interface ICreateUserRequest {
  username: string;
  grant: UserGrantType
}
