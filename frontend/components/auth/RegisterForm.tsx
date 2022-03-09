import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import { User } from "../../types/user/user";
import Text from "../Primitives/Text";
import ErrorMessages from "../../errors/errorMessages";
import schemaRegisterForm from "../../schema/schemaRegisterForm";
import { styled } from "../../stitches.config";

const StyledText = styled(Text, {
  backgroundColor: "$red5",
  fontWeight: "bold",
  p: "$16",
  width: "100%",
});

const StyledForm = styled("form", { width: "100%" });

const RegisterForm: React.FC = () => {
  const { setPw, createUser } = useUser();
  const { isError, error } = createUser;

  const methods = useForm<User>({
    resolver: zodResolver(schemaRegisterForm),
  });

  return (
    <TabsContent value="register">
      <FormProvider {...methods}>
        <StyledForm
          style={{ width: "100%" }}
          onSubmit={methods.handleSubmit((dataUser: User) => {
            if (dataUser.password) {
              setPw(dataUser?.password);
              createUser.mutate(dataUser);
            }
          })}
        >
          {isError ? (
            <Flex css={{ mb: "$16" }}>
              <StyledText color="red">
                {ErrorMessages[error?.response?.data.message] ?? ErrorMessages.DEFAULT}
              </StyledText>
            </Flex>
          ) : null}
          {/* <AuthFieldSet label="Email" inputType="text" id="email" />
          <AuthFieldSet label="Name" inputType="text" id="name" />
          <AuthFieldSet label="Password" inputType="password" id="password" />
          <AuthFieldSet label="Password confirmation" id="passwordConf" inputType="password" />
          <StyledButton color="green" size="2" type="submit" css={{ width: "100%" }}>
            Create account
          </StyledButton> */}
        </StyledForm>
      </FormProvider>
    </TabsContent>
  );
};

export default RegisterForm;
