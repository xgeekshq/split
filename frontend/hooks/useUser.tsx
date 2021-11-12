import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { postUser } from "../api/authService";
import { User, UseUserType } from "../types/user";

const useUser = (): UseUserType => {
  const createUser = useMutation<User, AxiosError, User, unknown>((user: User) => postUser(user), {
    mutationKey: "register",
    onSuccess: (user: User) => {
      console.log(user);
    },
  });

  return { createUser };
};

export default useUser;
