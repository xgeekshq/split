import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { useState } from 'react';
import { AddNewBoardButton } from '@/components/layouts/DashboardLayout/styles';
import Icon from '@/components/icons/Icon';
import { TitleSection } from './styles';
import { ListTeams } from '../TeamsDialog';

type UserHeaderProps = {
  firstName: string;
  lastName: string;
  isSAdmin: boolean;
  providerAccountCreatedAt?: string;
  joinedAt: string;
};

const UserHeader = ({
  firstName,
  lastName,
  isSAdmin,
  providerAccountCreatedAt,
  joinedAt,
}: UserHeaderProps) => {
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
                weight="medium"
              >
                SUPER ADMIN
              </Text>
            )}
          </Flex>
          <AddNewBoardButton size="sm" onClick={handleOpen}>
            <Icon css={{ color: 'white' }} name="plus" />
            Add user to new team
          </AddNewBoardButton>
        </TitleSection>
      </Flex>
      <Flex justify="end" css={{ mt: '$40' }}>
        <ListTeams
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          providerAccountCreatedAt={providerAccountCreatedAt}
          joinedAt={joinedAt}
        />
      </Flex>
    </Flex>
  );
};

export default UserHeader;
