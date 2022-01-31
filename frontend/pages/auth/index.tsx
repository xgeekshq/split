import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { styled } from "../../stitches.config";
import { TabsList, TabsRoot, TabsTrigger } from "../../components/Primitives/Tab";
import RegisterForm from "../../components/auth/RegisterForm";
import Text from "../../components/Primitives/Text";
import Flex from "../../components/Primitives/Flex";
import centerScreen from "../../styles/centerScreen";
import LoginForm from "../../components/auth/LoginForm";
import authenticated from "../../components/HOC/authenticated";

export const getServerSideProps: GetServerSideProps = authenticated(async () => {
  return {
    props: {},
  };
});

const CenteredContainer = styled(Flex, centerScreen);

const Auth: React.FC = () => {
  return (
    <Flex justify="center">
      <Link href="/">
        <h1>Divide and conquer</h1>
      </Link>
      <CenteredContainer
        css={{ mt: "$20", borderRadius: "$80", p: "$40", width: "500px", flexShrink: "2" }}
        justify="center"
      >
        <TabsRoot defaultValue="login">
          <TabsList aria-label="Login or register" css={{ mb: "$20" }}>
            <TabsTrigger value="login">
              <Text size="20">Login</Text>
            </TabsTrigger>
            <TabsTrigger value="register">
              <Text size="20">Register</Text>
            </TabsTrigger>
          </TabsList>
          <RegisterForm />
          <LoginForm />
        </TabsRoot>
      </CenteredContainer>
    </Flex>
  );
};

export default Auth;
