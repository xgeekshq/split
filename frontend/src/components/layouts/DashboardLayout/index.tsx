import { ReactNode } from 'react';
import Link from 'next/link';

import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Button from '@/components/Primitives/Button';
import { ContentSection } from './styles';

type DashboardLayoutProps = {
  children: ReactNode;
  firstName: string;
  isDashboard: boolean;
  isBoards: boolean;
  isTeams: boolean;
  isUsers: boolean;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children, firstName, isDashboard, isBoards, isTeams, isUsers } = props;

  return (
    <ContentSection gap="36" justify="between">
      <Flex css={{ width: '100%' }} direction="column" gap="40">
        <Flex justify="between">
          {isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
          {isBoards && <Text heading="1">Boards</Text>}
          {isTeams && <Text heading="1">Teams</Text>}
          {isUsers && <Text heading="1">Users</Text>}
          {(isDashboard || isBoards) && (
            <Link href="/boards/new">
              <Button size={isDashboard ? 'sm' : 'md'}>
                <Icon name="plus" />
                Add new board
              </Button>
            </Link>
          )}
          {isTeams && (
            <Link href="/teams/new">
              <Button size="md">
                <Icon name="plus" />
                Create new team
              </Button>
            </Link>
          )}
        </Flex>
        {children}
      </Flex>
      {/* {isDashboard && <CalendarBar />} */}
    </ContentSection>
  );
};

export default DashboardLayout;
