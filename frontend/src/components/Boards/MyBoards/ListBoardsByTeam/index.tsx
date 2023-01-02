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
import EmptyTeamBoards from '../EmptyTeamBoards';

interface ListBoardsByTeamProps {
  filteredTeam: Team;
  userId: string;
  isSuperAdmin: boolean;
  socket: Socket | null;
}

const ListBoardsByTeam = ({
  filteredTeam,
  userId,
  isSuperAdmin,
  socket,
}: ListBoardsByTeamProps) => {
  const setToastState = useSetRecoilState(toastState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoardsByTeam = useInfiniteQuery(
    ['boards', filteredTeam._id],
    ({ pageParam = 0 }) => getBoardsRequest(pageParam, filteredTeam._id),
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

  const dataByTeamAndDate = useMemo(() => {
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get(`${board.team?._id ?? `personal`}`);
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set(`${board.team?._id ?? `personal`}`, new Map([[date, [board]]]));
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
    return boardsTeamAndDate;
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoardsByTeam.hasNextPage) {
        fetchBoardsByTeam.fetchNextPage();
      }
    }
  };

  if (dataByTeamAndDate.size === 0 && !isLoading) {
    return <EmptyTeamBoards />;
  }

  return (
    <ScrollableContent direction="column" justify="start" ref={scrollRef} onScroll={onScroll}>
      {Array.from(dataByTeamAndDate).map(([team, boardsOfTeam]) => {
        const { users } = Array.from(boardsOfTeam)[0][1][0];
        return (
          <Flex key={team} css={{ mb: '$24' }} direction="column">
            <Flex key={filteredTeam._id} css={{ mb: '$24' }} direction="column">
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
              {/* to be used on the full version -> */}
              <Flex justify="end" css={{ width: '100%', marginBottom: '-5px' }}>
                <Flex
                  css={{
                    position: 'relative',
                    zIndex: '9',
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
                    Add new team board
                  </Text>
                </Flex>
              </Flex>
              <Flex css={{ zIndex: '1', marginTop: '-10px' }} direction="column" gap="16">
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
