import SidebarContent from '@/components/Sidebar/Content/Content';
import Header from '@/components/Sidebar/Header/Header';
import { StyledSidebar } from '@/components/Sidebar/styles';
import { SidebarProps, CollapsibleProps } from '@/components/Sidebar/types';
import { useState } from 'react';

const Sidebar = ({ firstName, lastName, email, strategy }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const collapsibleProps: CollapsibleProps = {
    isCollapsed,
    handleCollapse: setIsCollapsed,
  };

  return (
    <StyledSidebar collapsed={{ '@initial': isCollapsed, '@md': false }}>
      <Header email={email} firstName={firstName} lastName={lastName} {...collapsibleProps} />
      <SidebarContent strategy={strategy} {...collapsibleProps} />
    </StyledSidebar>
  );
};

export default Sidebar;
