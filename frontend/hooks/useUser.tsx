/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useMutation, useQuery } from "react-query";
import { checkUserExistsAD, registerNewUser, checkUserExists } from "../api/authService";
import { RegisterUser, User, UseUserType } from "../types/user/user";
import { DASHBOARD_ROUTE } from "../utils/routes";
import { transformLoginErrorCodes } from "../utils/errorCodes";
import { NEXT_PUBLIC_ENABLE_AZURE } from "../utils/constants";

const useUser = (setErrorCode: Dispatch<SetStateAction<number>>): UseUserType => {
  const router = useRouter();

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

  return { loginAzure };
};

export default useUser;
