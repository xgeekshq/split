import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useMutation } from "react-query";
import { resetTokenEmail, resetUserPassword } from "../api/authService";
import {
  EmailUser,
  NewPassword,
  ResetPasswordResponse,
  ResetTokenResponse,
  UseUserType,
} from "../types/user/user";
import { DASHBOARD_ROUTE } from "../utils/routes";
import { transformLoginErrorCodes } from "../utils/errorCodes";

const useUser = (setErrorCode?: Dispatch<SetStateAction<number>>): UseUserType => {
  const router = useRouter();

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

  const loginAzure = async () => {
    const loginResult = await signIn<RedirectableProviderType>("azure-ad", {
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (loginResult?.error && setErrorCode) {
      setErrorCode(transformLoginErrorCodes(loginResult.error));
      return;
    }
    router.push(DASHBOARD_ROUTE);
  };

  return { loginAzure, resetToken, resetPassword };
};

export default useUser;
