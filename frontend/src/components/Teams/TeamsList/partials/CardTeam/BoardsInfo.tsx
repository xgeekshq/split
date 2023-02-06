import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { Team } from '@/types/team/team';
import Link from 'next/link';

type BoardsInfoProps = {
  userSAdmin: boolean | undefined;
  teamAdminOrStakeholder: boolean;
  team: Team;
};

const BoardsInfo = ({ userSAdmin, teamAdminOrStakeholder, team }: BoardsInfoProps) => {
  if (team.boardsCount === 0) {
    return (
      <Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
        {(userSAdmin || teamAdminOrStakeholder) && (
          <Link
            href={{
              pathname: `/boards/new`,
              query: { team: team.id },
            }}
          >
            <StyledBoardTitle>
              <Flex css={{ alignItems: 'center' }}>
                <Icon
                  name="plus"
                  css={{
                    width: '$16',
                    height: '$32',
                    marginRight: '$5',
                  }}
                />
                <Text css={{ ml: '$8' }} size="sm" fontWeight="medium">
                  Create first team board
                </Text>
              </Flex>
            </StyledBoardTitle>
          </Link>
        )}
        {!teamAdminOrStakeholder && (
          <Text css={{ ml: '$14' }} size="sm" fontWeight="medium">
            0 boards
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
      <Link
        href={{
          pathname: `/boards`,
          query: { team: team.id },
        }}
      >
        <StyledBoardTitle>
          <Text css={{ ml: '$14' }} size="sm" fontWeight="medium">
            {team.boardsCount} team boards
          </Text>
        </StyledBoardTitle>
      </Link>
    </Flex>
  );
};

export default BoardsInfo;
