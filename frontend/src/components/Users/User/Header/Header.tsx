import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { useMemo, useState } from 'react';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { TeamChecked } from '@/types/team/team';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';
import Badge from '@/components/Primitives/Badge/Badge';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import TeamsDialog from '../TeamsDialog/TeamsDialog';

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
            <TeamsDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              confirmationLabel="Add new team"
              title="Teams"
              providerAccountCreatedAt={user.providerAccountCreatedAt}
              joinedAt={user.joinedAt}
              teamsList={teamCheckedList}
            />
          </>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserHeader;
