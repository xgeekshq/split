import { useRouter } from "next/dist/client/router";
import { styled } from "../../stitches.config";
import { ShouldRenderNav } from "../../utils/PagesNames";
import NavBar from "../NavBar/NavBar";
import Flex from "../Primitives/Flex";

const Main = styled("main", Flex, { px: "3vw", py: "$50" });

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  return (
    <>
      {ShouldRenderNav(router.asPath) && <NavBar />}
      <Main direction="column">{children}</Main>
    </>
  );
};

export default Layout;
