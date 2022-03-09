import type { NextPage } from "next";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import Banner from "../components/Primitives/Banner";
import Flex from "../components/Primitives/Flex";
import { TabsRoot, TabsList, TabsTrigger } from "../components/Primitives/Tab";
import Text from "../components/Primitives/Text";
import { styled } from "../stitches.config";

const CenteredContainer = styled(Flex, {
  position: "fixed",
  top: "202px",
  right: "162px",
  "&:focus": { outline: "none" },
});

const Home: NextPage = () => {
  return (
    <Flex
      css={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "$black",
        backgroundImage: "url(background.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Flex css={{ mt: "$74", ml: "$62" }}>
        <Banner />
      </Flex>
      <CenteredContainer>
        <TabsRoot defaultValue="login">
          <TabsList aria-label="Login or register" css={{ height: "$74" }}>
            <TabsTrigger value="login">
              <Text heading="4">Login</Text>
            </TabsTrigger>
            <TabsTrigger value="register">
              <Text heading="4">Register</Text>
            </TabsTrigger>
          </TabsList>
          <RegisterForm />
          <LoginForm />
        </TabsRoot>
      </CenteredContainer>
    </Flex>
  );
};

export default Home;
