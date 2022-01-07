import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { LoginUser } from "../../types/user";
import CompoundFieldSet from "./FieldSet/CompoundFieldSet";
import ErrorMessages from "../../errors/errorMessages";
import SchemaLoginForm from "../../schema/schemaLoginForm";
import { DASHBOARD_PATH } from "../../utils/constants";
import AuthButton from "./AuthButton";
import AuthError from "./AuthError";

const LoginForm: React.FC = () => {
  const [loginError, setLoginError] = useState(false);
  const methods = useForm<LoginUser>({
    resolver: yupResolver(SchemaLoginForm),
  });

  const onLogin = async (credentials: LoginUser) => {
    const response = await signIn<RedirectableProviderType>("credentials", {
      ...credentials,
      callbackUrl: DASHBOARD_PATH,
      redirect: false,
    });

    if (response?.error) {
      setLoginError(true);
    } else {
      setLoginError(false);
      router.push(DASHBOARD_PATH);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((credentials: LoginUser) => {
          onLogin(credentials);
        })}
      >
        {loginError && <AuthError text={ErrorMessages.INVALID_CREDENTIALS} />}
        <CompoundFieldSet label="Email" inputType="text" id="email" />
        <CompoundFieldSet label="Password" inputType="password" id="password" />
        <AuthButton label=" Sign in" />
      </form>
    </FormProvider>
  );
};

export default LoginForm;
