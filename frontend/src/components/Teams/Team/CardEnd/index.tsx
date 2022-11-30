import React from 'react';

import Flex from '@/components/Primitives/Flex';
import RoleDescription from '@/components/Teams/CreateTeam/CardEnd/RoleDescription';
import PopoverRoleSettings from '@/components/Teams/CreateTeam/CardMember/RoleSettings';

type CardEndTeamProps = {
  role: string;
  isTeamMember?: boolean;
  userId: string;
  isTeamCreator?: boolean;
  isTeamPage?: boolean;
};

const CardEndTeam = ({
  role,
  isTeamMember,
  userId,
  isTeamCreator,
  isTeamPage,
}: CardEndTeamProps) => (
  <Flex align="center" css={{ width: '$237' }} justify="end">
    <RoleDescription role={role} />
    {/* if current user is a just team member (can't edit role) and if the member of the members list is the current user => don't allow editing team role */}
    {!isTeamMember && !isTeamCreator && (
      <PopoverRoleSettings isTeamPage={isTeamPage} userId={userId} />
    )}
  </Flex>
);

export default CardEndTeam;
