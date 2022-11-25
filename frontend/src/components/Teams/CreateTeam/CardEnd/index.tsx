import React from 'react';

import Flex from '@/components/Primitives/Flex';
import PopoverRoleSettings from '../CardMember/RoleSettings';
import RoleDescription from './RoleDescription';

type CardEndCreateTeamProps = {
  role: string;
  isTeamCreator?: boolean;
  userId: string;
};

const CardEndCreateTeam = ({ role, isTeamCreator, userId }: CardEndCreateTeamProps) => (
  <Flex align="center" css={{ width: '23%' }} justify="end">
    <RoleDescription role={role} />
    {!isTeamCreator && <PopoverRoleSettings userId={userId} />}
  </Flex>
);

export default CardEndCreateTeam;
