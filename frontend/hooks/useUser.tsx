import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useMutation } from "react-query";
import { postUser } from "../api/authService";
import { LoginUser, User, UseUserType } from "../types/user/user";
import { DASHBOARD_ROUTE } from "../utils/routes";
import { errorCodes } from "../errors/errorMessages";

const useUser = (setLoginErrorCode: Dispatch<SetStateAction<number>>): UseUserType => {
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
        setLoginErrorCode(errorCodes(response.error));
      } else {
        router.push(DASHBOARD_ROUTE);
      }
    },
  });

  const loginAzure = async () => {
    const loginResult = await signIn<RedirectableProviderType>("azure-ad", {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (!loginResult?.error) {
      // setLoginErrorCode(errorCodes(loginResult?.error));
    } else {
      router.push(DASHBOARD_ROUTE);
    }
  };

  return { setPw, createUser, loginAzure };
};

export default useUser;
