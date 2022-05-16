import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Index from "../components/auth/LoginForm";
import TroubleLogin from "../components/auth/TroubleLogin";
import Banner from "../components/icons/Banner";
import Flex from "../components/Primitives/Flex";
import { TabsList, TabsRoot, TabsTrigger } from "../components/Primitives/Tab";
import Text from "../components/Primitives/Text";
import { styled } from "../stitches.config";
import { DASHBOARD_ROUTE } from "../utils/routes";

const CenteredContainer = styled(Flex, {
  position: "absolute",
  top: "$202",
  right: "$162",
  boxSizing: "border-box",
  "@media (max-height: 1023px)": {
    top: "calc((100vh - 710px) / 2)",
  },
  "&:focus": { outline: "none" },
});

const MainContainer = styled(Flex, {
  height: "100vh",
  width: "100%",
  position: "relative",
  backgroundColor: "$black",
  backgroundImage: "url(images/background.svg)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

const BannerContainer = styled(Flex, {
  mt: "$72",
  ml: "$112",
  size: "fit-content",
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: DASHBOARD_ROUTE,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Home: NextPage = () => {
  const [showTroubleLogin, setShowTroubleLogin] = useState(false);
  return (
    <MainContainer>
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <CenteredContainer>
        {!showTroubleLogin && (
          <TabsRoot defaultValue="login">
            <TabsList aria-label="Login or register">
              <TabsTrigger value="login">
                <Text heading="4">Log in</Text>
              </TabsTrigger>
              <TabsTrigger value="register">
                <Text heading="4">Sign up</Text>
              </TabsTrigger>
            </TabsList>
            <Index setShowTroubleLogin={setShowTroubleLogin} />
          </TabsRoot>
        )}
        {showTroubleLogin && <TroubleLogin setShowTroubleLogin={setShowTroubleLogin} />}
      </CenteredContainer>
    </MainContainer>
  );
};

export default Home;
