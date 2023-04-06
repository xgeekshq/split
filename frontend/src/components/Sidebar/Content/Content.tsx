import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Separator from '@/components/Primitives/Separator/Separator';
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
import SidebarItem from '@/components/Sidebar/Item/Item';
import { sidebarState } from '@/store/sidebar/atom/sidebar.atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { CollapsibleContent } from '../styles';

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

  const { collapsed } = useRecoilValue(sidebarState);
  const setSidebarState = useSetRecoilState(sidebarState);

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
    setSidebarState({ collapsed: true }); // Collapses sidebar when route changes
  }, [router.asPath]);

  return (
    <CollapsibleContent
      direction="column"
      data-testid="sidebarContent"
      collapsed={{ '@initial': collapsed, '@md': false }}
    >
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
    </CollapsibleContent>
  );
};

export default SidebarContent;
