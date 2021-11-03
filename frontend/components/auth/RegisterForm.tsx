import React from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import { TabsContent } from "../Primitives/Tab";
import { User } from "../../types/user";
import Text from "../Primitives/Text";
import { getMessageFromErrorCode } from "../../errors/errors";
import CompoundFieldSet from "./CompoundFieldSet";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { createUser } = useUser();
  const { isError, isSuccess, error } = createUser;

  const schema = yup
    .object()
    .shape({
      name: yup
        .string()
        .required("Please enter your name.")
        .min(2, "Your name must have more than 2 characters."),
      email: yup.string().required("Please insert your email.").email("This email is not valid."),
      password: yup
        .string()
        .required("Please enter your password.")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/,
          "Weak password, please check the info card."
        ),
      passwordConf: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match.")
        .required("Please enter a valid password."),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema),
  });

  // todo: if success -> login, save token, redirect dashboard
  if (isSuccess) router.push("/dashboard");

  return (
    <TabsContent value="register">
      <form
        onSubmit={handleSubmit(async (dataUser: User) => {
          createUser.mutate(dataUser);
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
              {getMessageFromErrorCode(error?.response?.data.message)}
            </Text>
          ) : null}
        </Flex>
        <CompoundFieldSet
          label="Email"
          inputType="text"
          id="email"
          errors={errors.email}
          register={register}
        />
        <CompoundFieldSet
          label="Name"
          inputType="text"
          id="name"
          errors={errors.name}
          register={register}
        />
        <CompoundFieldSet
          label="Password"
          inputType="password"
          id="password"
          errors={errors.password}
          register={register}
        />
        <CompoundFieldSet
          label="Password confirmation"
          id="passwordConf"
          inputType="password"
          errors={errors.passwordConf}
          register={register}
        />
        <Button color="green" size="2" css={{ mt: "$8", width: "100%" }} type="submit">
          Create account
        </Button>
      </form>
    </TabsContent>
  );
};

export default RegisterForm;
