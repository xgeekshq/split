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
import { errorCodes } from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import Logo from "../../public/icons/logo.svg";
import Input from "../Primitives/Input";
import Button from "../Primitives/Button";
import OrSeparator from "../Primitives/OrSeparator";
import { AUTH_SSO, NEXT_PUBLIC_ENABLE_AZURE, NEXT_PUBLIC_ENABLE_GIT } from "../../utils/constants";
import useUser from "../../hooks/useUser";
import MicrosoftIcon from "../../public/icons/microsoft.svg";
import GitHubIcon from "../../public/icons/gitHub.svg";

const StyledForm = styled("form", Flex, { width: "100%" });

interface LoginFormProps {
  setShowTroubleLogin: Dispatch<SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowTroubleLogin }) => {
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

  const handleLogin = async (credentials: LoginUser) => {
    try {
      setLoginErrorCode(0);
      const result = await signIn<RedirectableProviderType>("credentials", {
        ...credentials,
        callbackUrl: DASHBOARD_ROUTE,
        redirect: false,
      });
      if (!result?.error) {
        router.push(DASHBOARD_ROUTE);
      } else {
        setLoginErrorCode(errorCodes(result.error));
      }
    } catch (error) {
      setLoginErrorCode(errorCodes(error as unknown as string));
    }
  };

  const handleShowTrubleLogginIn = () => {
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
          <Logo />
          <Text css={{ mt: "$24" }} heading="1">
            Log In
          </Text>
          <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
            Enter your email and password to log in.
          </Text>
          <Input css={{ mt: "$32" }} id="email" type="text" placeholder="Email address" />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            icon="eye"
            iconPosition="right"
          />

          <Button
            type="submit"
            disabled={loginErrorCode === 0}
            size="lg"
            css={{
              fontWeight: "$medium",
              fontSize: "$18",
              "& svg": {
                height: "$40 !important",
                width: "$40 !important",
              },
            }}
          > 
          {loginErrorCode === 0 && <ThreeDots color="#FFFFF" height={80} width={80} />}
          {loginErrorCode !== 0 && "Log in"}
           
          </Button>
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
            onClick={handleShowTrubleLogginIn}
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
                  <Flex
                    css={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <GitHubIcon />
                  </Flex>
                )}
                {NEXT_PUBLIC_ENABLE_AZURE && (
                  <Flex
                    onClick={loginAzure}
                    css={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <MicrosoftIcon />
                  </Flex>
                )}
              </Flex>
            </Flex>
          )}
        </StyledForm>
      </FormProvider>
    </TabsContent>
  );
};

export default LoginForm;
