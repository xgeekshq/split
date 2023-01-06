import React, { useMemo, useRef } from 'react';

import { getPersonalBoardsRequest } from '@/api/boardService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useInfiniteQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import { Socket } from 'socket.io-client';
import ListBoards from '../ListBoards';

interface ListBoardsByTeamProps {
  userId: string;
  isSuperAdmin: boolean;
  socket: Socket | null;
}

const ListPersonalBoards = ({ userId, isSuperAdmin, socket }: ListBoardsByTeamProps) => {
  const setToastState = useSetRecoilState(toastState);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoardsByTeam = useInfiniteQuery(
    ['boards/personal'],
    ({ pageParam = 0 }) => getPersonalBoardsRequest(pageParam),
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

  //   const personalBoards = useMemo(() => {
  //     const teams = new Map<string, Team>();
  //     const boardsAndDate = new Map<string, BoardType[]>;

  //     data?.pages.forEach((page) => {
  //       page.boards?.forEach((board) => {
  //         boards.push(board);
  //         const date = new Date(board.updatedAt).toDateString();
  //         if (!boardsOfTeam) {
  //           boardsTeamAndDate.set(`personal`, new Map([[date, [board]]]));
  //           return;
  //         }
  //         const boardsOfDay = boardsOfTeam.get(date);
  //         if (boardsOfDay) {
  //           boardsOfDay.push(board);
  //           return;
  //         }
  //         boardsOfTeam.set(date, [board]);
  //       });
  //     });
  //     return { boards, teams };
  //   }, [data?.pages]);

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const date = new Date(board.updatedAt).toDateString();
        const boardsOfPersonal = boardsTeamAndDate.get('personal');
        if (!boardsOfPersonal) {
          boardsTeamAndDate.set('personal', new Map([[date, [board]]]));
          return;
        }
        boardsOfPersonal.set(date, [board]);
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

  //   if (personalBoards.length === 0 && !isLoading) {
  //     return (
  //       <ScrollableContent direction="column" justify="start" ref={scrollRef} onScroll={onScroll}>
  //         <Flex key="personal" css={{ mb: '$24' }} direction="column">
  //           <Flex
  //             direction="column"
  //             css={{
  //               position: 'sticky',
  //               zIndex: '5',
  //               top: '-0.4px',
  //               backgroundColor: '$background',
  //             }}
  //           >
  //             <TeamHeader
  //               team={dataByTeamAndDate.boardsTeamAndDate.get('personal')}
  //               userId={userId}
  //               users={filteredTeam.users}
  //             />
  //           </Flex>
  //           <EmptyPersonalBoards />
  //         </Flex>
  //       </ScrollableContent>
  //     );
  //   }

  return (
    <ListBoards
      userId={userId}
      isSuperAdmin={isSuperAdmin}
      dataByTeamAndDate={dataByTeamAndDate}
      scrollRef={scrollRef}
      onScroll={onScroll}
      filter="personal"
      isLoading={isLoading}
      socket={socket}
    />
  );
};

export default ListPersonalBoards;
