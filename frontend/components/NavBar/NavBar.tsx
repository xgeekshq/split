import Link from "next/link";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import Box from "../Primitives/Box";

const Header = styled("header", Flex, Box, { px: "$40", mb: "$40", py: "$20" });

const NavBar: React.FC = () => {
  return (
    <Header direction="row" justify="between" align="center" wrap="noWrap">
      <Link href="/">
        <Text>Divide & conquer</Text>
      </Link>
    </Header>
  );
};

export default NavBar;
