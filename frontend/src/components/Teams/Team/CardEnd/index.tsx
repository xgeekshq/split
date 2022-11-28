import React from 'react';

import Flex from '@/components/Primitives/Flex';
import RoleDescription from '@/components/Teams/CreateTeam/CardEnd/RoleDescription';
import PopoverRoleSettings from '@/components/Teams/CreateTeam/CardMember/RoleSettings';

type CardEndTeamProps = {
  role: string;
  isTeamMemberOrStakeholder?: boolean;
  userId: string;
  isTeamCreator?: boolean;
  isTeamPage?: boolean;
};

const CardEndTeam = ({
  role,
  isTeamMemberOrStakeholder,
  userId,
  isTeamCreator,
  isTeamPage,
}: CardEndTeamProps) => (
  <Flex align="center" css={{ width: '$237' }} justify="end">
    <RoleDescription role={role} />
    {!isTeamMemberOrStakeholder && !isTeamCreator && (
      <PopoverRoleSettings isTeamPage={isTeamPage} userId={userId} />
    )}
  </Flex>
);

export default CardEndTeam;
