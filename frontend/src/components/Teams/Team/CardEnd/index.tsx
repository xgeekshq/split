import React from 'react';

import Flex from '@/components/Primitives/Flex';
import RoleDescription from '@/components/Teams/CreateTeam/CardEnd/RoleDescription';
import PopoverRoleSettings from '@/components/Teams/CreateTeam/CardMember/RoleSettings';

type CardEndTeamProps = {
  role: string;
  isTeamMember?: boolean;
  userId: string;
  isTeamPage?: boolean;
  isSAdmin?: boolean;
};

const CardEndTeam = ({ role, isTeamMember, userId, isTeamPage, isSAdmin }: CardEndTeamProps) => (
  <Flex align="center" css={{ width: '$237' }} justify="end" gap="8">
    <RoleDescription role={role} />
    {(!isTeamMember || isSAdmin) && <PopoverRoleSettings isTeamPage={isTeamPage} userId={userId} />}
  </Flex>
);

export default CardEndTeam;
