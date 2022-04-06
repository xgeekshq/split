import { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { ThreeDots } from "react-loader-spinner";
import { styled } from "../../stitches.config";
import { LoginUser } from "../../types/user/user";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import Text from "../Primitives/Text";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import LogoIcon from "../icons/logo";
import Input from "../Primitives/Input";
import Button from "../Primitives/Button";
import OrSeparator from "../Primitives/OrSeparator";
import {
  AUTH_SSO,
  NEXT_PUBLIC_ENABLE_AZURE,
  NEXT_PUBLIC_ENABLE_GIT,
  NEXT_PUBLIC_ENABLE_GOOGLE,
} from "../../utils/constants";
import useUser from "../../hooks/useUser";
import MicrosoftIcon from "../icons/microsoft";
import GitHubIcon from "../icons/github";
import { transformLoginErrorCodes } from "../../utils/errorCodes";
import Toast from "../Primitives/Toast";
import { ToastStateEnum } from "../../utils/enums/toast-types";
import { getAuthError } from "../../errors/auth-messages";

const StyledForm = styled("form", Flex, { width: "100%" });

const LoginButton = styled(Button, {
  fontWeight: "$medium",
  "& svg": {
    height: "$40 !important",
    width: "$40 !important",
  },
});

const StyledHoverIconFlex = styled("div", Flex, {
  "&:hover": {
    "&[data-loading='true']": {
      cursor: "default",
    },
    "&[data-loading='false']": {
      cursor: "pointer",
    },
  },
});

interface LoginFormProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowTroubleLogin }) => {
  const [loading, setLoading] = useState({ credentials: false, sso: false });
  const [toastOpened, setToastOpened] = useState<boolean>(false);
  const [loginErrorCode, setLoginErrorCode] = useState(-1);
  const { loginAzure } = useUser(setLoginErrorCode);
  const methods = useForm<LoginUser>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SchemaLoginForm),
  });

  const clearErrors = () => {
    setToastOpened(false);
    setLoading({ credentials: false, sso: false });
    setLoginErrorCode(-1);
  };

  const handleLoginAzure = () => {
    if (loading.sso) return;
    setLoading((prevState) => ({ ...prevState, sso: true }));
    loginAzure();
  };

  const handleLogin = async (credentials: LoginUser) => {
    setLoading((prevState) => ({ ...prevState, credentials: true }));
    const result = await signIn<RedirectableProviderType>("credentials", {
      ...credentials,
      callbackUrl: DASHBOARD_ROUTE,
      redirect: false,
    });
    if (!result?.error) {
      router.push(DASHBOARD_ROUTE);
      return;
    }
    setToastOpened(true);
    setLoading((prevState) => ({ ...prevState, credentials: false }));
    setLoginErrorCode(transformLoginErrorCodes(result.error));
  };

  const handleShowTroubleLogginIn = () => {
    setShowTroubleLogin(true);
  };

  return (
    <TabsContent value="login">
      <FormProvider {...methods}>
        <StyledForm
          autoComplete="off"
          direction="column"
          style={{ width: "100%" }}
          onSubmit={methods.handleSubmit((credentials: LoginUser) => {
            handleLogin(credentials);
          })}
        >
          <LogoIcon />
          <Text css={{ mt: "$24" }} heading="1">
            Log In
          </Text>
          <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
            Enter your email and password to log in.
          </Text>
          <Input
            clearErrorCode={clearErrors}
            state={loginErrorCode > 0 ? "error" : undefined}
            css={{ mt: "$32" }}
            id="email"
            type="text"
            placeholder="Email address"
          />
          <Input
            clearErrorCode={clearErrors}
            state={loginErrorCode > 0 ? "error" : undefined}
            id="password"
            type="password"
            placeholder="Password"
            icon="eye"
            iconPosition="right"
          />

          <LoginButton type="submit" disabled={loading.credentials} size="lg">
            {loading.credentials && <ThreeDots color="black" height={80} width={80} />}
            {!loading.credentials && "Log in"}
          </LoginButton>
          <Text
            size="sm"
            css={{
              alignSelf: "center",
              mt: "$16",
              "&:hover": {
                textDecorationLine: "underline",
                cursor: "pointer",
              },
            }}
            onClick={handleShowTroubleLogginIn}
          >
            Forgot password
          </Text>
          {AUTH_SSO && (
            <Flex justify="center" align="center" direction="column">
              <Flex
                css={{
                  mt: "$24",
                  mb: "$32",
                }}
              >
                <OrSeparator />
              </Flex>
              <Flex gap="32">
                {NEXT_PUBLIC_ENABLE_GIT && (
                  <StyledHoverIconFlex>
                    <GitHubIcon />
                  </StyledHoverIconFlex>
                )}
                {NEXT_PUBLIC_ENABLE_GOOGLE && (
                  <StyledHoverIconFlex>
                    <GitHubIcon />
                  </StyledHoverIconFlex>
                )}
                {NEXT_PUBLIC_ENABLE_AZURE && (
                  <StyledHoverIconFlex data-loading={loading.sso} onClick={handleLoginAzure}>
                    <MicrosoftIcon />
                  </StyledHoverIconFlex>
                )}
              </Flex>
            </Flex>
          )}
        </StyledForm>
      </FormProvider>
      <Toast
        open={toastOpened}
        onOpenChange={setToastOpened}
        type={ToastStateEnum.ERROR}
        content={getAuthError(loginErrorCode)}
      />
    </TabsContent>
  );
};

export default LoginForm;
