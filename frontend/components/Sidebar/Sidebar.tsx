import { ProSidebar } from "react-pro-sidebar";
import Header from "./Header";
import { styled } from "../../stitches.config";
import Flex from "../Primitives/Flex";
import SideBarContent from "./Content";

const StyledSideBar = styled(ProSidebar, Flex, {
  backgroundColor: "$primary800",
});

type SideBarProps = {
  firstName: string;
  lastName: string;
  email: string;
  collapsed?: boolean;
  strategy: string;
};

const SideBar: React.FC<SideBarProps> = ({ firstName, lastName, email, strategy, collapsed }) => {
  SideBar.defaultProps = { collapsed: false };
  return (
    <StyledSideBar collapsed={collapsed} collapsedWidth="128px">
      <Header firstName={firstName} lastName={lastName} email={email} />
      <SideBarContent strategy={strategy} />
    </StyledSideBar>
  );
};

export default SideBar;
