import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { useState } from 'react';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { TeamChecked } from '@/types/team/team';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ListTeams } from '../TeamsDialog';
import { TitleSection } from './styles';

type UserHeaderProps = {
  firstName: string;
  lastName: string;
  isSAdmin: boolean;
  providerAccountCreatedAt?: string;
  joinedAt: string;
};

type Team = {
  _id: string;
  name: string;
};

const UserHeader = ({
  firstName,
  lastName,
  isSAdmin,
  providerAccountCreatedAt,
  joinedAt,
}: UserHeaderProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId } = router.query;
  const [isOpen, setIsOpen] = useState(false);

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    {
      title: 'Users',
      link: '/users',
    },
    {
      title: `${firstName} ${lastName}`,
      isActive: true,
    },
  ];

  // after fetching data, add the field "isChecked", to be used in the Add button
  const teamsUserIsNotMember: TeamChecked[] = (
    queryClient.getQueryData<Team[]>(['teamsUserIsNotMember', userId]) || []
  ).map((team) => ({ ...team, _id: team._id, isChecked: false }));

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <Flex align="center" justify="between" css={{ width: '100%' }}>
      <Flex direction="column" css={{ width: '100%' }}>
        <Flex align="center" css={{ pb: '$12' }}>
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <TitleSection>
          <Flex css={{ flex: 1 }} align="center">
            <Text heading="1">
              {firstName} {lastName}
            </Text>
            {isSAdmin && (
              <Text
                css={{
                  ml: '$14',
                  background: '$primary1000',
                  borderStyle: 'solid',
                  borderColor: '$primary900',
                  borderWidth: 'thin',
                  color: '$primary900',
                  borderRadius: '$12',
                  padding: '$8',
                  height: '1.55rem',
                  lineHeight: '$8',
                }}
                size="sm"
                fontWeight="medium"
              >
                SUPER ADMIN
              </Text>
            )}
          </Flex>
          <Button size="sm" onClick={handleOpen}>
            <Icon name="plus" />
            Add user to new team
          </Button>
        </TitleSection>
      </Flex>
      <Flex justify="end" css={{ mt: '$40' }}>
        <ListTeams
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          providerAccountCreatedAt={providerAccountCreatedAt}
          joinedAt={joinedAt}
          teamsList={teamsUserIsNotMember}
        />
      </Flex>
    </Flex>
  );
};

export default UserHeader;
