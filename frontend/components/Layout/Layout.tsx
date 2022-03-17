import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import { REFRESH_TOKEN_ERROR } from "../../utils/constants";
import "react-toastify/dist/ReactToastify.css";

const Main = styled("main", Flex, { px: "3vw", py: "$50", height: "100%" });

const Layout: React.FC = ({ children }) => {
  const { data: session, status } = useSession({ required: false });

  useEffect(() => {
    if (session?.error === REFRESH_TOKEN_ERROR) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  return (
    <div>
      <Main direction="column">{children}</Main>
      <ToastContainer limit={3} />
    </div>
  );
};

export default Layout;
