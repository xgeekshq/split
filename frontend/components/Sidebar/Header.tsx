import { FC } from "react";
import { SidebarHeader } from "react-pro-sidebar";
import Flex from "../Primitives/Flex";
import HeaderBannerIcon from "../icons/HeaderBanner";
import Text from "../Primitives/Text";
import Separator from "./Separator";
import { styled } from "../../stitches.config";

const StyledHeader = styled(SidebarHeader, Flex);

const Header: FC<{ firstName: string; lastName: string; email: string }> = ({
  firstName,
  lastName,
  email,
}) => {
  const initialLetters = firstName.charAt(0) + lastName.charAt(0);

  return (
    <StyledHeader direction="column">
      <Flex css={{ p: "$40" }}>
        <HeaderBannerIcon />
      </Flex>
      <Separator />
      <Flex
        align="center"
        gap="12"
        css={{
          p: "$24",
          color: "$white",
          backgroundColor: "$primary700",
        }}
      >
        <Flex
          align="center"
          justify="center"
          css={{
            size: "$58",
            backgroundImage: "url(/icons/userIcon.svg)",
          }}
        >
          <Text heading="5">{initialLetters}</Text>
        </Flex>
        <Flex direction="column">
          <Text css={{ color: "$white" }} weight="medium" size="sm">
            {`${firstName} ${lastName}`}
          </Text>
          <Text css={{ color: "$primary200" }} weight="medium" size="xs">
            {email}
          </Text>
        </Flex>
      </Flex>
      <Separator />
    </StyledHeader>
  );
};

export default Header;
