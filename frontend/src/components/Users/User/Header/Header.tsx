import { useMemo, useState } from 'react';

import Badge from '@/components/Primitives/Badge/Badge';
import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import TeamsDialog from '@/components/Users/User/TeamsDialog/TeamsDialog';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TeamChecked } from '@/types/team/team';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';

export type UserHeaderProps = {
  user: User;
};

const UserHeader = ({ user }: UserHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const { data: teamsUserIsNotMember } = useTeamsWithoutUser(user._id);

  const teamCheckedList: TeamChecked[] = useMemo(() => {
    if (!teamsUserIsNotMember) return [];

    return teamsUserIsNotMember.map((team) => ({ ...team, _id: team._id, isChecked: false }));
  }, [teamsUserIsNotMember]);

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    { title: 'Users', link: ROUTES.Users },
    { title: `${user.firstName} ${user.lastName}`, isActive: true },
  ];

  return (
    <Flex align="center" data-testid="userHeader" justify="between">
      <Flex css={{ width: '100%' }} direction="column" gap="12">
        <Flex align="center">
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <Flex justify="between">
          <Flex align="center" gap="32">
            <Text heading="1">
              {user.firstName} {user.lastName}
            </Text>
            {user.isSAdmin && (
              <Badge pill size="sm" variant="success">
                SUPER ADMIN
              </Badge>
            )}
          </Flex>
          <>
            <Button onClick={handleOpen} size="sm">
              <Icon name="plus" />
              Add user to new team
            </Button>
            <TeamsDialog
              confirmationLabel="Add new team"
              isOpen={isOpen}
              joinedAt={user.joinedAt}
              providerAccountCreatedAt={user.providerAccountCreatedAt}
              setIsOpen={setIsOpen}
              teamsList={teamCheckedList}
              title="Teams"
            />
          </>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserHeader;
