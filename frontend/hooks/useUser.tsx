import { useState } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useMutation } from "react-query";
import { postUser } from "../api/authService";
import { LoginUser, User, UseUserType } from "../types/user";
import { DASHBOARD_ROUTE, ERROR_500_PAGE } from "../utils/routes";

const useUser = (): UseUserType => {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const createUser = useMutation<User, AxiosError, User, unknown>((user: User) => postUser(user), {
    mutationKey: "register",
    onSuccess: async (user: User) => {
      const credentials: LoginUser = { email: user.email, password: pw };
      const response = await signIn<RedirectableProviderType>("credentials", {
        ...credentials,
        callbackUrl: DASHBOARD_ROUTE,
        redirect: false,
      });
      setPw("");
      if (response?.error) {
        router.push(ERROR_500_PAGE);
      } else {
        router.push(DASHBOARD_ROUTE);
      }
    },
  });

  return { setPw, createUser };
};

export default useUser;
