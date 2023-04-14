import { useState } from 'react';

import SidebarContent from '@/components/Sidebar/Content/Content';
import Header from '@/components/Sidebar/Header/Header';
import { StyledSidebar } from '@/components/Sidebar/styles';
import { CollapsibleProps, SidebarProps } from '@/components/Sidebar/types';

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
