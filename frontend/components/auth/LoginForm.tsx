import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { styled } from "../../stitches.config";
import { LoginUser } from "../../types/user";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import Text from "../Primitives/Text";
import Button from "../Primitives/Button";
import AuthFieldSet from "./FieldSet/AuthFieldSet";
import ErrorMessages from "../../errors/errorMessages";
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
  const [loginError, setLoginError] = useState(false);
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
        setLoginError(true);
      }
    } catch (error) {
      setLoginError(true);
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
          {loginError ? (
            <Flex css={{ mb: "$16" }}>
              <StyledText color="red">{ErrorMessages.INVALID_CREDENTIALS}</StyledText>
            </Flex>
          ) : null}
          <AuthFieldSet label="Email" inputType="text" id="email" />
          <AuthFieldSet label="Password" inputType="password" id="password" tabValue="login" />
          <StyledButton color="green" size="2" type="submit">
            Login
          </StyledButton>
        </StyledForm>
      </FormProvider>
    </TabsContent>
  );
};

export default LoginForm;
