import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { StyledMenuItem } from '@/components/Sidebar/styles';

export type SidebarItemProps = {
  link?: string;
  active?: string;
  iconName: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ link, active, iconName, label, disabled, onClick }: SidebarItemProps) => {
  const isActiveItem = link && active?.includes(link);

  const renderStyledMenuItem = () => (
    <StyledMenuItem
      align="center"
      data-active={isActiveItem}
      data-testid="sidebarItem"
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={iconName} />
      <Text color="primary300" size="sm">
        {label}
      </Text>
    </StyledMenuItem>
  );

  if (onClick) {
    // Used for the Logout Button
    return renderStyledMenuItem();
  }

  if (link && !disabled) {
    // Used for Navigation
    return <Link href={link}>{renderStyledMenuItem()}</Link>;
  }
  // Used for 'Coming Soon'
  return (
    <Tooltip color="primary100" content="Coming Soon">
      {renderStyledMenuItem()}
    </Tooltip>
  );
};

export default SidebarItem;
