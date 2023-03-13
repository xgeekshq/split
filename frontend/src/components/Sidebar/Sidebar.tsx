import SidebarContent from './Content/Content';
import Header from './Header/Header';
import { StyledSidebar } from './styles';

export type SidebarProps = {
  firstName: string;
  lastName: string;
  email: string;
  // collapsed?: boolean;
  strategy: string;
};

const Sidebar = ({ firstName, lastName, email, strategy }: SidebarProps) => (
  <StyledSidebar>
    <Header email={email} firstName={firstName} lastName={lastName} />
    <SidebarContent strategy={strategy} />
  </StyledSidebar>
);

export default Sidebar;
