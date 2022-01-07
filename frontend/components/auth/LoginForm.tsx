import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { RedirectableProviderType } from "next-auth/providers";
import { getSession, signIn } from "next-auth/react";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { LoginUser } from "../../types/user";
import CompoundFieldSet from "./FieldSet/CompoundFieldSet";
import ErrorMessages from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import AuthButton from "./AuthButton";
import AuthError from "./AuthError";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import { instance } from "../../utils/fetchData";
import Form from "../Primitives/Form";

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
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit((credentials: LoginUser) => {
          onLogin(credentials);
        })}
        css={{ width: "100%" }}
      >
        {loginError && <AuthError text={ErrorMessages.INVALID_CREDENTIALS} />}
        <CompoundFieldSet label="Email" inputType="text" id="email" />
        <CompoundFieldSet label="Password" inputType="password" id="password" />
        <AuthButton label=" Sign in" />
      </Form>
    </FormProvider>
  );
};

export default LoginForm;
