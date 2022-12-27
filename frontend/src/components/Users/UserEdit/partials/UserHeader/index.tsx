import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { useState } from 'react';
import { TitleSection } from './styles';
import { ListTeams } from '../TeamsDialog';

type UserHeaderProps = {
  firstName: string;
  lastName: string;
  isSAdmin: boolean;
};

const UserHeader = ({ firstName, lastName, isSAdmin }: UserHeaderProps) => {
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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex align="center" justify="between" css={{ width: '100%' }}>
      <Flex direction="column">
        <Flex align="center" css={{ pb: '$12' }}>
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <TitleSection>
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
        </TitleSection>
      </Flex>
      <Flex justify="end" css={{ mt: '$40' }}>
        <ListTeams isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    </Flex>
  );
};

export default UserHeader;
