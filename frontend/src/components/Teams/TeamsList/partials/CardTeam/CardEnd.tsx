import React from 'react';

import Flex from '@/components/Primitives/Flex';
import { Team } from '@/types/team/team';
import DeleteTeam from './DeleteTeam';

type CardEndProps = {
  team: Team;
  havePermissions: boolean;
  teamUserId?: string;
  userSAdmin?: boolean;
  userIsParticipating: boolean;
  isTeamPage?: boolean | undefined;
};

const CardEnd: React.FC<CardEndProps> = React.memo(
  ({ team, havePermissions, teamUserId, userSAdmin = undefined, isTeamPage }) => {
    CardEnd.defaultProps = {
      userSAdmin: undefined,
    };
    const { name } = team;

    if (userSAdmin || havePermissions) {
      return (
        <Flex css={{ alignItems: 'center' }}>
          <Flex align="center" css={{ ml: '$24' }} gap="24">
            <DeleteTeam
              teamName={name}
              teamId={team._id}
              teamUserId={teamUserId}
              isTeamPage={isTeamPage}
            />
          </Flex>
        </Flex>
      );
    }

    return null;
  },
);

export default CardEnd;
