import SidebarContent from '@/components/Sidebar/Content/Content';
import Header from '@/components/Sidebar/Header/Header';
import { StyledSidebar } from '@/components/Sidebar/styles';
import { sidebarState } from '@/store/sidebar/atom/sidebar.atom';
import { useRecoilValue } from 'recoil';

export type SidebarProps = {
  firstName: string;
  lastName: string;
  email: string;
  strategy: string;
};

const Sidebar = ({ firstName, lastName, email, strategy }: SidebarProps) => {
  const { collapsed } = useRecoilValue(sidebarState);
  return (
    <StyledSidebar collapsed={{ '@initial': collapsed, '@md': false }}>
      <Header email={email} firstName={firstName} lastName={lastName} />
      <SidebarContent strategy={strategy} />
    </StyledSidebar>
  );
};

export default Sidebar;
