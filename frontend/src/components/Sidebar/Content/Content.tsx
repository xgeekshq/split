import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import SidebarItem from '@/components/Sidebar/Item/Item';
import {
  ACCOUNT_ROUTE,
  AZURE_LOGOUT_ROUTE,
  BOARDS_ROUTE,
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  START_PAGE_ROUTE,
  TEAMS_ROUTE,
  USERS_ROUTE,
} from '@/utils/routes';

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
    <Flex css={{ mt: '$16' }} data-testid="sidebarContent" direction="column">
      {sidebarItems.map((item) => (
        <SidebarItem {...item} key={item.label} active={active} />
      ))}

      <Separator css={{ my: '$16', backgroundColor: '$primary600' }} />

      <SidebarItem
        disabled
        active={active}
        iconName="user-circle"
        label="Account"
        link={ACCOUNT_ROUTE}
      />
      <SidebarItem
        disabled
        active={active}
        iconName="settings"
        label="Settings"
        link={SETTINGS_ROUTE}
      />

      <Separator css={{ my: '$16', backgroundColor: '$primary600' }} />

      <SidebarItem active={active} iconName="log-out" label="Log out" onClick={handleSignOut} />
    </Flex>
  );
};

export default SidebarContent;
