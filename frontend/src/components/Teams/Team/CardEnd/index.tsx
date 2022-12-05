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
  isSAdmin?: boolean;
};

const CardEndTeam = ({
  role,
  isTeamMember,
  userId,
  isTeamCreator,
  isTeamPage,
  isSAdmin,
}: CardEndTeamProps) => (
  <Flex align="center" css={{ width: '$237' }} justify="end">
    <RoleDescription role={role} />
    {!isSAdmin && !isTeamMember && !isTeamCreator && (
      <PopoverRoleSettings isTeamPage={isTeamPage} userId={userId} />
    )}
    {isSAdmin && <PopoverRoleSettings isTeamPage={isTeamPage} userId={userId} />}
  </Flex>
);

export default CardEndTeam;
