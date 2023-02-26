import { UserGrantType } from "../types/userGrant.types";

export default interface IUserPayload {
  userId: string;
  grant: UserGrantType
}
