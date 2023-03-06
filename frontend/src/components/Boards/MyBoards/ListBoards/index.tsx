import React from 'react';
import { useRecoilValue } from 'recoil';
import BoardType from '@/types/board/board';
import LoadingPage from '@/components/Primitives/Loading/Page';
import CardBody from '@/components/CardBoard/CardBody/CardBody';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/Primitives/Icon';
import { teamsListState } from '@/store/team/atom/team.atom';
import { Team } from '@/types/team/team';
import Link from 'next/link';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Button from '@/components/Primitives/Button';
import { User } from '@/types/user/user';
import { ScrollableContent } from '../styles';
import TeamHeader from '../../TeamHeader';

interface ListBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
  dataByTeamAndDate: {
    boardsTeamAndDate: Map<string, Map<string, BoardType[]>>;
    teams: Map<string, Team>;
    createdByUsers: Map<string, User>;
  };
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  filter: string;
  isLoading: boolean;
}

const ListBoards = React.memo<ListBoardsProps>(
  ({ userId, isSuperAdmin, dataByTeamAndDate, scrollRef, onScroll, filter, isLoading }) => {
    const currentDate = new Date().toDateString();
    const allTeamsList = useRecoilValue(teamsListState);
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
        direction="column"
        justify="start"
        ref={scrollRef}
        onScroll={onScroll}
        css={{ height: 'calc(100vh - 225px)', paddingBottom: '$8' }}
      >
        {Array.from(dataByTeamAndDate.boardsTeamAndDate).map(([teamId, boardsOfTeam], index) => {
          const { users } = Array.from(boardsOfTeam)[0][1][0];
          const teamFound = allTeamsList.find((team) => team.id === teamId);
          if (!['all', 'personal'].includes(filter) && teamId !== filter) return null;
          const boardCreator =
            isSuperAdmin && teamId !== userId
              ? dataByTeamAndDate.createdByUsers.get(teamId)
              : undefined;

          const isPersonalBoard = !Array.from(dataByTeamAndDate.teams.keys()).includes(teamId);
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
                <TeamHeader
                  team={teamFound}
                  userId={userId}
                  users={users}
                  personalBoardCreator={boardCreator}
                />
              </Flex>
              <Flex justify="end" css={{ width: '100%', minHeight: '15px' }}>
                {/* when is super Admin, show 'add new board' on SA personal boards,
                he can't add personal boards for anyone else */}
                {((isSuperAdmin && ((isPersonalBoard && userId === teamId) || !isPersonalBoard)) ||
                  // if not superAdmin, the endpoint will only return the current user's boards,
                  // thus show 'add new board' to all personal boards
                  (!isSuperAdmin && isPersonalBoard) ||
                  isTeamAdmin(boardsOfTeam)) && (
                  <Link
                    href={{
                      pathname: teamId === userId ? `/boards/newRegularBoard` : `/boards/new`,
                      query: { team: teamId },
                    }}
                  >
                    <Button variant="link" size="sm" css={{ zIndex: '9' }}>
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
