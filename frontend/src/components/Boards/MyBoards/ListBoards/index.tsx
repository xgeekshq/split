import React from 'react';
import Link from 'next/link';

import { ScrollableContent } from '@/components/Boards/MyBoards/styles';
import TeamHeader from '@/components/Boards/TeamHeader';
import CardBody from '@/components/CardBoard/CardBody/CardBody';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useTeams from '@/hooks/teams/useTeams';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';

interface ListBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
  dataByTeamAndDate: {
    boardsTeamAndDate: Map<string, Map<string, BoardType[]>>;
    teams: Map<string, Team>;
  };
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  filter: string;
  isLoading: boolean;
}

const ListBoards = React.memo<ListBoardsProps>(
  ({ userId, isSuperAdmin, dataByTeamAndDate, scrollRef, onScroll, filter, isLoading }) => {
    const currentDate = new Date().toDateString();
    const teamsQuery = useTeams(isSuperAdmin);
    const allTeamsList = teamsQuery.data ?? [];

    const isTeamAdmin = (boards: Map<string, BoardType[]>) => {
      const { team } = Array.from(boards)[0][1][0];
      if (!team) return false;

      return team.users.find(
        (user) =>
          user.user?._id === userId &&
          [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(user.role),
      );
    };

    return (
      <ScrollableContent
        css={{ height: 'calc(100vh - 225px)', paddingBottom: '$8' }}
        direction="column"
        justify="start"
        onScroll={onScroll}
        ref={scrollRef}
      >
        {Array.from(dataByTeamAndDate.boardsTeamAndDate).map(([teamId, boardsOfTeam], index) => {
          const { users } = Array.from(boardsOfTeam)[0][1][0];
          const teamFound = allTeamsList.find((team) => team.id === teamId);
          if (filter !== 'all' && teamId !== filter) return null;
          return (
            <Flex key={teamId} css={{ mt: index !== 0 ? '$32' : '' }} direction="column">
              <Flex
                direction="column"
                css={{
                  position: 'sticky',
                  zIndex: '5',
                  top: '-0.4px',
                  backgroundColor: '$background',
                  marginBottom: '-5px',
                }}
              >
                <TeamHeader team={teamFound} userId={userId} users={users} />
              </Flex>
              <Flex css={{ width: '100%', minHeight: '15px' }} justify="end">
                {(isSuperAdmin ||
                  isTeamAdmin(boardsOfTeam) ||
                  !Array.from(dataByTeamAndDate.teams.keys()).includes(teamId)) && (
                  <Link
                    href={{
                      pathname: teamId === 'personal' ? ROUTES.NewRegularBoard : ROUTES.NewBoard,
                      query: { team: teamId },
                    }}
                  >
                    <Button css={{ zIndex: '9' }} size="sm" variant="link">
                      <Icon name="plus" />
                      {!Array.from(dataByTeamAndDate.teams.keys()).includes(teamId)
                        ? 'Add new personal board'
                        : 'Add new team board'}
                    </Button>
                  </Link>
                )}
              </Flex>
              <Flex css={{ zIndex: '1', marginTop: '-10px' }} direction="column" gap="32">
                {Array.from(boardsOfTeam).map(([date, boardsOfDay]) => {
                  const formatedDate = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <Flex key={date} direction="column">
                      <Text
                        color="primary300"
                        size="xs"
                        css={{
                          position: 'sticky',
                          zIndex: '5',
                          top: '-0.2px',
                          height: '$24',
                          backgroundColor: '$background',
                        }}
                      >
                        Last updated -{' '}
                        {date === currentDate ? `Today, ${formatedDate}` : formatedDate}
                      </Text>
                      <Flex direction="column" gap="8">
                        {boardsOfDay.map((board: BoardType) => (
                          <CardBody
                            key={board._id}
                            board={board}
                            dividedBoardsCount={board.dividedBoards.length}
                            isDashboard={false}
                            isSAdmin={isSuperAdmin}
                            userId={userId}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}

        {isLoading && <LoadingPage />}
      </ScrollableContent>
    );
  },
);
export default ListBoards;
