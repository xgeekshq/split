import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { Team } from '@/types/team/team';
import Link from 'next/link';

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
                css={{
                  width: '$16',
                  height: '$32',
                  marginRight: '$5',
                }}
              />
              <Text css={{ ml: '$8' }} size="sm" fontWeight="medium" link>
                Create first board
              </Text>
            </Flex>
          </Link>
        )}
        {!havePermissions && (
          <Text size="sm" fontWeight="medium">
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
        <Text size="sm" fontWeight="medium" link>
          {team.boardsCount} team boards
        </Text>
      </Link>
    </Flex>
  );
};

export default TeamBoards;
