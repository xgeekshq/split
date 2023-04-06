import SidebarContent from '@/components/Sidebar/Content/Content';
import Header from '@/components/Sidebar/Header/Header';
import { StyledSidebar } from '@/components/Sidebar/styles';

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
