import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import Separator from '@/components/Primitives/Separator';
import {
  ACCOUNT_ROUTE,
  BOARDS_ROUTE,
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  START_PAGE_ROUTE,
  TEAMS_ROUTE,
  USERS_ROUTE,
} from '@/utils/routes';
import { StyledMenuItem, StyledText } from './styles';

interface SidebarContentProps {
  strategy: string;
}

const SideBarContent: React.FC<SidebarContentProps> = ({ strategy }) => {
  const router = useRouter();
  const [active, setActive] = useState(router.asPath);
  const isStrategyLocal = strategy === 'local';

  const handleSignOut = async () => {
    const result = await signOut({
      callbackUrl: isStrategyLocal ? START_PAGE_ROUTE : '/logoutAzure',
      redirect: !isStrategyLocal,
    });
    if (result && isStrategyLocal) {
      router.push(result.url);
    }
  };

  useEffect(() => {
    setActive(router.asPath);
  }, [router.asPath]);

  return (
    <Flex direction="column">
      <Link href={DASHBOARD_ROUTE}>
        <StyledMenuItem align="center" data-active={active === DASHBOARD_ROUTE}>
          <Icon name="dashboard" />
          <StyledText>Dashboard</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={BOARDS_ROUTE}>
        <StyledMenuItem align="center" data-active={active.includes(BOARDS_ROUTE)}>
          <Icon name="boards" />
          <StyledText>Boards</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={USERS_ROUTE}>
        <StyledMenuItem align="center" data-active={active.includes(USERS_ROUTE)}>
          <Icon name="user" />
          <StyledText>Users</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={TEAMS_ROUTE}>
        <StyledMenuItem align="center" data-active={active.includes(TEAMS_ROUTE)}>
          <Icon name="team" />
          <StyledText>Teams</StyledText>
        </StyledMenuItem>
      </Link>
      <Separator css={{ marginTop: '$16', marginBottom: '$16', backgroundColor: '$primary600' }} />
      <Tooltip color="primary100" content="Coming Soon">
        <StyledMenuItem disabled align="center" data-active={active === ACCOUNT_ROUTE}>
          <Icon name="user-circle" />
          <StyledText>Account</StyledText>
        </StyledMenuItem>
      </Tooltip>

      <Tooltip color="primary100" content="Coming Soon">
        <StyledMenuItem
          disabled
          align="center"
          css={{ mb: '$16' }}
          data-active={active === SETTINGS_ROUTE}
        >
          <Icon name="settings" />
          <StyledText>Settings</StyledText>
        </StyledMenuItem>
      </Tooltip>

      <Separator css={{ marginTop: '$16', marginBottom: '$16', backgroundColor: '$primary600' }} />
      <StyledMenuItem align="center" css={{ mt: '$16' }} onClick={handleSignOut}>
        <Icon name="log-out" />
        <StyledText>Log out</StyledText>
      </StyledMenuItem>
    </Flex>
  );
};

export default SideBarContent;
