import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { styled } from "../../stitches.config";
import { LoginUser } from "../../types/user/user";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import Text from "../Primitives/Text";
import ErrorMessages, { errorCodes } from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import Logo from "../Primitives/icons/logo";

const StyledText = styled(Text, {
  backgroundColor: "$red5",
  fontWeight: "bold",
  p: "$16",
  width: "100%",
});
const StyledForm = styled("form", Flex, { width: "100%" });

const LoginForm: React.FC = () => {
  const [loginErrorCode, setLoginErrorCode] = useState(0);
  const methods = useForm<LoginUser>({
    resolver: zodResolver(SchemaLoginForm),
  });

  const onLogin = async (credentials: LoginUser) => {
    try {
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

  return (
    <TabsContent value="login" css={{ mb: "$48" }}>
      <FormProvider {...methods}>
        <StyledForm
          direction="column"
          style={{ width: "100%" }}
          onSubmit={methods.handleSubmit((credentials: LoginUser) => {
            onLogin(credentials);
          })}
        >
          <Logo />
          <Text css={{ mt: "$24" }} heading="1">
            Log In
          </Text>
          <Text size="md" css={{ mt: "$8", color: "$primary500" }}>
            Enter your email and password to log in.
          </Text>
          {loginErrorCode > 0 ? (
            <Flex css={{ mb: "$16" }}>
              <StyledText color="red">
                {loginErrorCode === 401
                  ? ErrorMessages.INVALID_CREDENTIALS
                  : ErrorMessages.USER_NOT_FOUND}
              </StyledText>
            </Flex>
          ) : null}
        </StyledForm>
      </FormProvider>
    </TabsContent>
  );
};

export default LoginForm;
