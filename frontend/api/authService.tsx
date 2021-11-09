import { User } from "../types/user";
import fetchData from "../utils/fetchData";

const postUser = (newUser: User): Promise<User> => {
  return fetchData(`/auth/register`, "POST", JSON.stringify(newUser));
};

export default postUser;
