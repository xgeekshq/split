import React from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { FormProvider, useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import { User } from "../../types/user";
import Text from "../Primitives/Text";
import ErrorMessages from "../../errors/errorMessages";
import CompoundFieldSet from "./FieldSet/CompoundFieldSet";
import schemaRegisterForm from "../../schema/schemaRegisterForm";
import AuthButton from "./AuthButton";

const RegisterForm: React.FC = () => {
  const { setPw, createUser } = useUser();
  const { isError, error } = createUser;

  const methods = useForm<User>({
    resolver: yupResolver(schemaRegisterForm),
  });

  return (
    <TabsContent value="register">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((dataUser: User) => {
            if (dataUser.password) {
              setPw(dataUser?.password);
              createUser.mutate(dataUser);
            }
          })}
        >
          <Flex>
            {isError ? (
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
                {ErrorMessages[error?.response?.data.message] ?? ErrorMessages.DEFAULT}
              </Text>
            ) : null}
          </Flex>
          <CompoundFieldSet label="Email" inputType="text" id="email" />
          <CompoundFieldSet label="Name" inputType="text" id="name" />
          <CompoundFieldSet label="Password" inputType="password" id="password" />
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
    </TabsContent>
  );
};

export default RegisterForm;
