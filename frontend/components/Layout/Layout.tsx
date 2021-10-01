import { styled } from "../../stitches.config";

const Main = styled("main", { display: "block", px: "$40" });

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Main>{children}</Main>
    </>
  );
};

export default Layout;
