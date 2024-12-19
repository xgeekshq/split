import React from 'react';

import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { User } from '@/types/user/user';
import { getInitials } from '@/utils/getInitials';

type FilterBoardMembersProps = {
  title: string;
  users: User[];
};

const FilterBoardMembers = ({ title, users }: FilterBoardMembersProps) => (
  <Flex align="start" css={{ pb: '$20' }} direction="column">
    <Text css={{ display: 'block', px: '$32', py: '$10', pt: '$20' }} heading="4">
      {title}
    </Text>
    <Flex css={{ px: '$32', py: '$10' }} direction="column" gap={16}>
      {users.map((member) =>
        member ? (
          <Flex key={member._id} align="center">
            <Avatar
              key={`${member}-${member._id}-${Math.random()}`}
              css={{ position: 'relative', mr: '$10' }}
              fallbackText={getInitials(member.firstName ?? '-', member.lastName ?? '-')}
              size={32}
              src={member.avatar}
            />
            <Text color="primary800" size="sm">
              {`${member.firstName} ${member.lastName}`}
            </Text>
          </Flex>
        ) : null,
      )}
    </Flex>
  </Flex>
);

export { FilterBoardMembers };
