import { useRouter } from "next/dist/client/router";
import { styled } from "../../stitches.config";
import NavBar from "../NavBar/NavBar";
import Flex from "../Primitives/Flex";

const Main = styled("main", Flex, { px: "$40", py: "$50" });

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const isRoot = router.asPath === "/";
  return (
    <>
      {!isRoot && <NavBar />}
      <Main direction="column">{children}</Main>
    </>
  );
};

export default Layout;
