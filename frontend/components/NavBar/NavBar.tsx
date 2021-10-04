import Link from "next/link";
import { useContext } from "react";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import TitleContext from "../../store/title-context";
import Dropdown from "./DropdownMenu";

const Header = styled("header", Flex, {
  px: "$40",
  mb: "$40",
  py: "$8",
  backgroundColor: "White",
  boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
});

const NavBar: React.FC = () => {
  const titleCtx = useContext(TitleContext);

  return (
    <Header justify="between" align="center" media="sm">
      <Link href="/">
        <Text fontWeight="medium" size="lg">
          Divide & conquer
        </Text>
      </Link>
      <Text fontWeight="semiBold" size="xl">
        {titleCtx.title}
      </Text>
      <Dropdown />
    </Header>
  );
};

export default NavBar;
