import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Button from '@/components/Primitives/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { ROUTES } from '@/utils/routes';
import { useState } from 'react';
import { ListMembers } from '../ListMembers';

export type TeamHeaderProps = {
  title: string;
  hasPermissions: boolean;
};

const TeamHeader = ({ title, hasPermissions }: TeamHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    { title: 'Teams', link: ROUTES.Teams },
    { title, isActive: true },
  ];

  return (
    <Flex align="center" justify="between" data-testid="teamHeader">
      <Flex direction="column" gap="12" css={{ width: '100%' }}>
        <Flex align="center">
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <Flex justify="between">
          <Text heading="1">{title}</Text>
          {hasPermissions && (
            <>
              <Button size="sm" onClick={handleOpen}>
                <Icon name="plus" />
                Add / remove members
              </Button>
              <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} isTeamPage />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TeamHeader;
