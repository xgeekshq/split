import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { styled } from "../../stitches.config";
import NavBar from "../NavBar/NavBar";
import Flex from "../Primitives/Flex";
import { REFRESH_TOKEN_ERROR } from "../../utils/constants";
import "react-toastify/dist/ReactToastify.css";
import { ShouldRenderNav } from "../../utils/routes";
import { getHeaderToken, setHeaderToken } from "../../utils/fetchData";

const Main = styled("main", Flex, { px: "3vw", py: "$50" });

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: false });

  if (status === "authenticated" && getHeaderToken() !== `Bearer ${session?.accessToken}`) {
    setHeaderToken(session?.accessToken);
  }

  useEffect(() => {
    if (session?.error === REFRESH_TOKEN_ERROR) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading</div>;
  }
  return (
    <>
      {ShouldRenderNav(router.asPath) && <NavBar />}
      <Main direction="column">{children}</Main>
      <ToastContainer />
    </>
  );
};

export default Layout;
