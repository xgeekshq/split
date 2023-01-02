import React, { useMemo, useRef } from 'react';

import { getBoardsRequest } from '@/api/boardService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useInfiniteQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import LoadingPage from '@/components/loadings/LoadingPage';
import CardBody from '@/components/CardBoard/CardBody/CardBody';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';
import { Socket } from 'socket.io-client';
import { ScrollableContent } from '../styles';
import TeamHeader from '../../TeamHeader';

interface ListBoardsByTeamProps {
  teamId: string;
  userId: string;
  isSuperAdmin: boolean;
  socket: Socket | null;
}

const ListBoardsByTeam = ({ teamId, userId, isSuperAdmin, socket }: ListBoardsByTeamProps) => {
  const setToastState = useSetRecoilState(toastState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoardsByTeam = useInfiniteQuery(
    'boards',
    ({ team = teamId, pageParam = 0 }) => getBoardsRequest(pageParam, team),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the boards',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );
  const { data, isLoading } = fetchBoardsByTeam;

  const currentDate = new Date().toDateString();

  // if (!data) return null;
  // // console.log(data);
  // data.pages.forEach((page) => console.log(page.boards));

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get(`${board.team?._id ?? `personal`}`);
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set(`${board.team?._id ?? `personal`}`, new Map([[date, [board]]]));
          if (board.team) teams.set(`${board.team?._id}`, board.team);
          return;
        }
        const boardsOfDay = boardsOfTeam.get(date);
        if (boardsOfDay) {
          boardsOfDay.push(board);
          return;
        }
        boardsOfTeam.set(date, [board]);
      });
    });
    return { boardsTeamAndDate, teams };
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoardsByTeam.hasNextPage) {
        fetchBoardsByTeam.fetchNextPage();
      }
    }
  };

  const filteredTeam = dataByTeamAndDate.teams.get(teamId);

  // if (isEmpty(dataByTeamAndDate.boardsTeamAndDate.size) && !isLoading) {
  //   return <EmptyBoards />;
  // }
  if (!filteredTeam) return null;

  return (
    <ScrollableContent direction="column" justify="start" ref={scrollRef} onScroll={onScroll}>
      {/* <Flex>
        <Flex
          direction="column"
          css={{
            position: 'sticky',
            zIndex: '5',
            top: '-0.4px',
            backgroundColor: '$background',
          }}
        >
          <TeamHeader team={filteredTeam} userId={userId} users={users} />
        </Flex>
      </Flex> */}
      {Array.from(dataByTeamAndDate.boardsTeamAndDate).map(([team, boardsOfTeam]) => {
        // console.log(teamsList.find((team) => teamId === filter));
        const { users } = Array.from(boardsOfTeam)[0][1][0];
        // if (teamFiltered && teamId !== teamFiltered._id) {
        //   return (
        //     <Flex key={teamId} css={{ mb: '$24' }} direction="column">
        //       <Flex
        //         direction="column"
        //         css={{
        //           position: 'sticky',
        //           zIndex: '5',
        //           top: '-0.4px',
        //           backgroundColor: '$background',
        //         }}
        //       >
        // <TeamHeader team={filteredTeam} userId={userId} users={users} />;
        //       </Flex>
        //     </Flex>
        //   );
        // }
        return (
          <Flex key={team} css={{ mb: '$24' }} direction="column">
            <Flex key={teamId} css={{ mb: '$24' }} direction="column">
              <Flex
                direction="column"
                css={{
                  position: 'sticky',
                  zIndex: '5',
                  top: '-0.4px',
                  backgroundColor: '$background',
                }}
              >
                <TeamHeader
                  team={dataByTeamAndDate.teams.get(teamId)}
                  userId={userId}
                  users={users}
                />
              </Flex>
              {/* </Flex> */}
              <Flex css={{ zIndex: '1' }} direction="column" gap="16">
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
                      {/* to be used on the full version -> */}
                      <Flex justify="end" css={{ width: '100%' }}>
                        <Flex
                          css={{
                            position: 'relative',
                            zIndex: '30',
                            '& svg': { size: '$16' },
                            right: 0,
                            top: '$-22',
                          }}
                          gap="8"
                        >
                          <Icon
                            name="plus"
                            css={{
                              width: '$16',
                              height: '$32',
                              marginRight: '$5',
                            }}
                          />
                          <Text
                            heading="6"
                            css={{
                              width: 'fit-content',
                              display: 'flex',
                              alignItems: 'center',
                              '@hover': {
                                '&:hover': {
                                  cursor: 'pointer',
                                },
                              },
                            }}
                          >
                            {!Array.from(dataByTeamAndDate.teams.keys()).includes(team)
                              ? 'Add new personal board'
                              : 'Add new team board'}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex direction="column" gap="20">
                        {boardsOfDay.map((board: BoardType) => (
                          <CardBody
                            key={board._id}
                            board={board}
                            dividedBoardsCount={board.dividedBoards.length}
                            isDashboard={false}
                            isSAdmin={isSuperAdmin}
                            socketId={socket?.id}
                            userId={userId}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        );
      })}

      {isLoading && <LoadingPage />}
    </ScrollableContent>
  );
};

export { ListBoardsByTeam };
