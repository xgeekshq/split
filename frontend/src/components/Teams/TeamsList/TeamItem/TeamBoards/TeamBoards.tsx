import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { Team } from '@/types/team/team';

export type TeamBoardsProps = {
  havePermissions: boolean;
  team: Team;
};

const TeamBoards = ({ havePermissions, team }: TeamBoardsProps) => {
  if (team.boardsCount === 0) {
    return (
      <Flex align="center" data-testid="teamitemBoards">
        {havePermissions && (
          <Link
            href={{
              pathname: `/boards/new`,
              query: { team: team.id },
            }}
          >
            <Flex css={{ alignItems: 'center' }}>
              <Icon
                name="plus"
                size={16}
                css={{
                  marginRight: '$5',
                  color: '$primaryBase',
                }}
              />
              <Text link css={{ ml: '$8' }} fontWeight="medium" size="sm">
                Create first board
              </Text>
            </Flex>
          </Link>
        )}
        {!havePermissions && (
          <Text fontWeight="medium" size="sm">
            No boards
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex align="center" data-testid="teamitemBoards">
      <Link
        href={{
          pathname: `/boards`,
          query: { team: team.id },
        }}
      >
        <Text link fontWeight="medium" size="sm">
          {team.boardsCount} team boards
        </Text>
      </Link>
    </Flex>
  );
};

export default TeamBoards;
