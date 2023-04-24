import { useState } from 'react';

import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import ListMembers from '@/components/Teams/Team/ListMembers/ListMembers';
import { ROUTES } from '@/constants/routes';
import { BreadcrumbType } from '@/types/board/Breadcrumb';

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
    <Flex align="center" data-testid="teamHeader" justify="between">
      <Flex css={{ width: '100%' }} direction="column" gap="12">
        <Flex align="center">
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <Flex justify="between">
          <Text heading="1">{title}</Text>
          {hasPermissions && (
            <>
              <Button onClick={handleOpen} size="sm">
                <Icon name="plus" />
                Add / remove members
              </Button>
              <ListMembers isTeamPage isOpen={isOpen} setIsOpen={setIsOpen} />
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TeamHeader;
