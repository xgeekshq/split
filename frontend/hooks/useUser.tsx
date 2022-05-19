/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useMutation } from "react-query";
import { postUser, resetTokenEmail } from "../api/authService";
import { EmailUser, LoginUser, ResetTokenResponse, User, UseUserType } from "../types/user/user";
import { useMutation, useQuery } from "react-query";
import { checkUserExistsAD, registerNewUser, checkUserExists } from "../api/authService";
import { RegisterUser, User, UseUserType } from "../types/user/user";
import { postUser, resetTokenEmail, resetUserPassword } from "../api/authService";
import {
  EmailUser,
  LoginUser,
  NewPassword,
  ResetPasswordResponse,
  ResetTokenResponse,
  User,
  UseUserType,
} from "../types/user/user";
import { DASHBOARD_ROUTE } from "../utils/routes";
import { transformLoginErrorCodes } from "../utils/errorCodes";
import { NEXT_PUBLIC_ENABLE_AZURE } from "../utils/constants";

const useUser = (setErrorCode: Dispatch<SetStateAction<number>>): UseUserType => {
const useUser = (setLoginErrorCode?: Dispatch<SetStateAction<number>>): UseUserType => {
  const router = useRouter();
  const [pw, setPw] = useState("");

  const resetToken = useMutation<ResetTokenResponse, AxiosError, EmailUser>(
    (emailUser: EmailUser) => resetTokenEmail(emailUser),
    {
      mutationKey: "forgotPassword",
      onSuccess: async (response: ResetTokenResponse) => {
        return response.message;
      },
    }
  );

  const resetPassword = useMutation<ResetPasswordResponse, AxiosError, NewPassword>(
    (data: NewPassword) => resetUserPassword(data),
    {
      mutationKey: "resetPassword",
      onSuccess: async (response: ResetPasswordResponse) => {
        return response.message;
      },
    }
  );

  const createUser = useMutation<User, AxiosError, User>((user: User) => postUser(user), {
    mutationKey: "register",
    onSuccess: async (user: User) => {
      const credentials: LoginUser = { email: user.email, password: pw };
      const response = await signIn<RedirectableProviderType>("credentials", {
        ...credentials,
        callbackUrl: DASHBOARD_ROUTE,
        redirect: false,
      });
      setPw("");
      if (response?.error && setLoginErrorCode) {
        setLoginErrorCode(transformLoginErrorCodes(response.error));
        return;
      }
      router.push(DASHBOARD_ROUTE);
    },
  });

  const loginAzure = async () => {
    const loginResult = await signIn<RedirectableProviderType>("azure-ad", {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (loginResult?.error) {
      setErrorCode(transformLoginErrorCodes(loginResult.error));
      return;
    }
    router.push(DASHBOARD_ROUTE);
  };

  return { setPw, createUser, loginAzure, resetToken, resetPassword };
};

export default useUser;
