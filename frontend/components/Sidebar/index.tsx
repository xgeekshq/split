import Header from "./partials/Header";
import SideBarContent from "./partials/Content";
import { StyledSidebar } from "./styles";

type SideBarProps = {
  firstName: string;
  lastName: string;
  email: string;
  // collapsed?: boolean;
  strategy: string;
};

const Sidebar = ({ firstName, lastName, email, strategy }: SideBarProps) => {
  return (
    <StyledSidebar>
      <Header firstName={firstName} lastName={lastName} email={email} />
      <SideBarContent strategy={strategy} />
    </StyledSidebar>
  );
};

export { Sidebar };
