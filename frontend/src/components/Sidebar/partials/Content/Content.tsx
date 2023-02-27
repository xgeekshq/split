import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import {
  ACCOUNT_ROUTE,
  BOARDS_ROUTE,
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  START_PAGE_ROUTE,
  TEAMS_ROUTE,
  USERS_ROUTE,
  AZURE_LOGOUT_ROUTE,
} from '@/utils/routes';
import SidebarItem from '../Item/Item';

export type SidebarContentProps = {
  strategy: string;
};

const sidebarItems = [
  { link: DASHBOARD_ROUTE, iconName: 'dashboard', label: 'Dashboard' },
  { link: BOARDS_ROUTE, iconName: 'boards', label: 'Boards' },
  { link: USERS_ROUTE, iconName: 'user', label: 'Users' },
  { link: TEAMS_ROUTE, iconName: 'team', label: 'Teams' },
];

const SidebarContent = ({ strategy }: SidebarContentProps) => {
  const router = useRouter();
  const [active, setActive] = useState(router.asPath);
  const isStrategyLocal = strategy === 'local';

  const handleSignOut = async () => {
    const result = await signOut({
      callbackUrl: isStrategyLocal ? START_PAGE_ROUTE : AZURE_LOGOUT_ROUTE,
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
    <Flex direction="column" css={{ mt: '$16' }} data-testid="sidebarContent">
      {sidebarItems.map((item) => (
        <SidebarItem {...item} active={active} key={item.label} />
      ))}

      <Separator css={{ my: '$16', backgroundColor: '$primary600' }} />

      <SidebarItem
        disabled
        link={ACCOUNT_ROUTE}
        iconName="user-circle"
        label="Account"
        active={active}
      />
      <SidebarItem
        disabled
        link={SETTINGS_ROUTE}
        iconName="settings"
        label="Settings"
        active={active}
      />

      <Separator css={{ my: '$16', backgroundColor: '$primary600' }} />

      <SidebarItem iconName="log-out" label="Log out" active={active} onClick={handleSignOut} />
    </Flex>
  );
};

export default SidebarContent;
