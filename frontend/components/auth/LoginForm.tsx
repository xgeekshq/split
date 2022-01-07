import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { getSession, signIn } from "next-auth/react";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { RedirectableProviderType } from "next-auth/providers";
import { LoginUser } from "../../types/user";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import Text from "../Primitives/Text";
import Button from "../Primitives/Button";
import CompoundFieldSet from "./FieldSet/CompoundFieldSet";
import ErrorMessages from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import { instance } from "../../utils/fetchData";

const LoginForm: React.FC = () => {
  const [loginError, setLoginError] = useState(false);
  const methods = useForm<LoginUser>({
    resolver: yupResolver(SchemaLoginForm),
  });

  const onLogin = async (credentials: LoginUser) => {
    try {
      await signIn<RedirectableProviderType>("credentials", {
        ...credentials,
        callbackUrl: DASHBOARD_ROUTE,
        redirect: false,
      });
      const session = await getSession();
      instance.defaults.headers.common.Authorization = `Bearer ${session?.accessToken}`;
      router.push(DASHBOARD_ROUTE);
    } catch (error) {
      setLoginError(true);
    }
  };

  return (
    <TabsContent value="login">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((credentials: LoginUser) => {
            onLogin(credentials);
          })}
        >
          <Flex>
            {loginError ? (
              <Text
                color="red"
                css={{
                  mb: "$16",
                  backgroundColor: "$red5",
                  fontWeight: "bold",
                  p: "$16",
                  width: "100%",
                }}
              >
                {ErrorMessages.INVALID_CREDENTIALS}
              </Text>
            ) : null}
          </Flex>
          <CompoundFieldSet label="Email" inputType="text" id="email" />
          <CompoundFieldSet label="Password" inputType="password" id="password" tabValue="login" />
          <Button color="green" size="2" css={{ mt: "$8", width: "100%" }} type="submit">
            Login
          </Button>
        </form>
      </FormProvider>
    </TabsContent>
  );
};

export default LoginForm;
