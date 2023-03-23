import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { useState } from 'react';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { TeamChecked } from '@/types/team/team';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';
import Badge from '@/components/Primitives/Badge/Badge';
import { TEAMS_KEY } from '@/hooks/useTeam';
import { ListTeams } from '../TeamsDialog/TeamsDialog';

export type UserHeaderProps = {
  user: User;
};

type Team = {
  _id: string;
  name: string;
};

const UserHeader = ({ user }: UserHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    { title: 'Users', link: ROUTES.Users },
    { title: `${user.firstName} ${user.lastName}`, isActive: true },
  ];

  // after fetching data, add the field "isChecked", to be used in the Add button
  const queryClient = useQueryClient();
  const teamsUserIsNotMember: TeamChecked[] = (
    queryClient.getQueryData<Team[]>([TEAMS_KEY, 'not', 'user', user._id]) || []
  ).map((team) => ({ ...team, _id: team._id, isChecked: false }));

  return (
    <Flex align="center" justify="between" data-testid="userHeader">
      <Flex direction="column" gap="12" css={{ width: '100%' }}>
        <Flex align="center">
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <Flex justify="between">
          <Flex align="center" gap="32">
            <Text heading="1">
              {user.firstName} {user.lastName}
            </Text>
            {user.isSAdmin && (
              <Badge variant="success" pill size="sm">
                SUPER ADMIN
              </Badge>
            )}
          </Flex>
          <>
            <Button size="sm" onClick={handleOpen}>
              <Icon name="plus" />
              Add user to new team
            </Button>
            <ListTeams
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              confirmationLabel="Add new team"
              title="Teams"
              providerAccountCreatedAt={user.providerAccountCreatedAt}
              joinedAt={user.joinedAt}
              teamsList={teamsUserIsNotMember}
            />
          </>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserHeader;
