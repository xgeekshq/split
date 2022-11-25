import SideBarContent from './partials/Content';
import Header from './partials/Header';
import { StyledSidebar } from './styles';

type SideBarProps = {
  firstName: string;
  lastName: string;
  email: string;
  // collapsed?: boolean;
  strategy: string;
};

const Sidebar = ({ firstName, lastName, email, strategy }: SideBarProps) => (
  <StyledSidebar>
    <Header email={email} firstName={firstName} lastName={lastName} />
    <SideBarContent strategy={strategy} />
  </StyledSidebar>
);

export { Sidebar };
