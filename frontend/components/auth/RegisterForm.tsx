import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUser from "../../hooks/useUser";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import { User } from "../../types/user";
import Text from "../Primitives/Text";
import ErrorMessages from "../../errors/errorMessages";
import CompoundFieldSet from "./FieldSet/AuthFieldSet";
import schemaRegisterForm from "../../schema/schemaRegisterForm";

const RegisterForm: React.FC = () => {
  const { setPw, createUser } = useUser();
  const { isError, error } = createUser;

  const methods = useForm<User>({
    resolver: zodResolver(schemaRegisterForm),
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
          <CompoundFieldSet label="Password confirmation" id="passwordConf" inputType="password" />
          <Button color="green" size="2" css={{ mt: "$8", width: "100%" }} type="submit">
            Create account
          </Button>
        </form>
      </FormProvider>
    </TabsContent>
  );
};

export default RegisterForm;
