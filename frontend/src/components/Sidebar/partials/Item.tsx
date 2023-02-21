import Link from 'next/link';

import Icon from '@/components/Primitives/Icon';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';

import { StyledMenuItem } from '../styles';

export type SidebarItemType = {
  link?: string;
  active?: string;
  iconName: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ link, active, iconName, label, disabled, onClick }: SidebarItemType) => {
  const renderStyledMenuItem = () => (
    <StyledMenuItem
      data-testid="sidebarItem"
      align="center"
      data-active={active === link}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={iconName} />
      <Text size="sm" color="primary300">
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
