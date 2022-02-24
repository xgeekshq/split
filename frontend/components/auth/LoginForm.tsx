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
import Button from "../Primitives/Button";
import AuthFieldSet from "./FieldSet/AuthFieldSet";
import ErrorMessages, { errorCodes } from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_ROUTE } from "../../utils/routes";

const StyledText = styled(Text, {
  backgroundColor: "$red5",
  fontWeight: "bold",
  p: "$16",
  width: "100%",
});
const StyledButton = styled(Button, { mt: "$8", width: "100%" });
const StyledForm = styled("form", { width: "100%" });

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
    <TabsContent value="login">
      <FormProvider {...methods}>
        <StyledForm
          style={{ width: "100%" }}
          onSubmit={methods.handleSubmit((credentials: LoginUser) => {
            onLogin(credentials);
          })}
        >
          {loginErrorCode > 0 ? (
            <Flex css={{ mb: "$16" }}>
              <StyledText color="red">
                {loginErrorCode === 401
                  ? ErrorMessages.INVALID_CREDENTIALS
                  : ErrorMessages.USER_NOT_FOUND}
              </StyledText>
            </Flex>
          ) : null}
          <AuthFieldSet label="Email" inputType="text" id="email" />
          <AuthFieldSet label="Password" inputType="password" id="password" tabValue="login" />
          <StyledButton color="green" size="2" type="submit" css={{ width: "100%" }}>
            Login
          </StyledButton>
        </StyledForm>
      </FormProvider>
    </TabsContent>
  );
};

export default LoginForm;
