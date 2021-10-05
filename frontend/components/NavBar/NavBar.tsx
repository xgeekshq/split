import Link from "next/link";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import Dropdown from "./DropdownMenu";
import Title from "./Title";

const Header = styled("header", Flex, {
  px: "$40",
  py: "$8",
  backgroundColor: "White",
  boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
});

const NavBar: React.FC = () => {
  return (
    <Header justify="between" align="center" media="sm">
      <Link href="/">
        <Text fontWeight="medium" size="lg">
          Divide & conquer
        </Text>
      </Link>
      <Title />
      <Dropdown />
    </Header>
  );
};

export default NavBar;
