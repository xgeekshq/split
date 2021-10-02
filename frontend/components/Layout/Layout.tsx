import { styled } from "../../stitches.config";
import NavBar from "../NavBar/NavBar";

const Main = styled("main", { display: "block", px: "$40" });

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <NavBar />
      <Main>{children}</Main>
    </>
  );
};

export default Layout;
