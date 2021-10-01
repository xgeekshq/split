import { styled } from "../../stitches.config";

const Layout: React.FC = ({ children }) => {
  const Main = styled("main", { display: "block", px: "$40" });

  // Navbar, Main and footer and footer

  return (
    <>
      <Main>{children}</Main>
    </>
  );
};

export default Layout;
