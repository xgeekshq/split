import React from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { FormProvider, useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import { User } from "../../types/user";
import ErrorMessages from "../../errors/errorMessages";
import CompoundFieldSet from "./FieldSet/CompoundFieldSet";
import schemaRegisterForm from "../../schema/schemaRegisterForm";
import AuthButton from "./AuthButton";
import AuthError from "./AuthError";

const RegisterForm: React.FC = () => {
  const { setPw, createUser } = useUser();
  const { isError, error } = createUser;

  const methods = useForm<User>({
    resolver: yupResolver(schemaRegisterForm),
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((dataUser: User) => {
          if (dataUser.password) {
            setPw(dataUser?.password);
            createUser.mutate(dataUser);
          }
        })}
      >
        {isError && (
          <AuthError text={ErrorMessages[error?.response?.data.message] ?? ErrorMessages.DEFAULT} />
        )}
        <CompoundFieldSet label="Name" inputType="text" id="name" />
        <CompoundFieldSet label="Email" inputType="text" id="email" />
        <CompoundFieldSet label="Password" inputType="password" id="password" showHoverCard />
        <CompoundFieldSet
          label="Password confirmation"
          id="passwordConf"
          inputType="password"
          showHoverCard
        />
        <CompoundFieldSet
          label="By signing up you agree to our Terms and Privacy Policy"
          id="termsAndPrivacyPolicy"
          inputType="checkbox"
        />
        <AuthButton label="Sign up" />
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
