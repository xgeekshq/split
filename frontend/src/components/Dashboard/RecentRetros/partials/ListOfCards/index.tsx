import React, { useMemo, useRef } from 'react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import CardBody from '@/components/CardBoard/CardBody/CardBody';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import BoardType from '@/types/board/board';
import { LastUpdatedText } from '@/components/Dashboard/RecentRetros/partials/ListOfCards/styles';

type ListOfCardsProp = {
  data: InfiniteData<{ boards: BoardType[]; hasNextPage: boolean }> | undefined;
  userId: string;
  isLoading: boolean;
  fetchBoards: UseInfiniteQueryResult<
    {
      boards: BoardType[];
      hasNextPage: boolean;
      page: number;
    },
    unknown
  >;
};

const ListOfCards = React.memo<ListOfCardsProp>(({ data, userId, fetchBoards, isLoading }) => {
  const currentDate = new Date().toDateString();
  const scrollRef = useRef<HTMLDivElement>(null);

  const boardsSplitedByDay = useMemo(() => {
    const boardsByDay = new Map<string, BoardType[]>();
    data?.pages.forEach((p) => {
      p.boards.forEach((board) => {
        const date = new Date(board.updatedAt).toDateString();
        const boardsForDay = boardsByDay.get(date);
        if (boardsForDay) {
          boardsForDay.push(board);
        } else {
          boardsByDay.set(date, [board]);
        }
      });
    });
    return boardsByDay;
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  return (
    <Flex
      css={{ mt: '$24', height: 'calc(100vh - 410px)', overflow: 'auto', pr: '$10' }}
      direction="column"
      gap="32"
      justify="start"
      ref={scrollRef}
      onScroll={onScroll}
    >
      {Array.from(boardsSplitedByDay).map(([date, splitedBoard]) => {
        const formatedDate = new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        return (
          <Flex key={date} direction="column" gap="8">
            <LastUpdatedText color="primary300" size="xs">
              Last updated - {date === currentDate ? `Today, ${formatedDate}` : formatedDate}
            </LastUpdatedText>
            <Flex direction="column" gap="8">
              {splitedBoard.map((board: BoardType) => (
                <CardBody
                  key={board._id}
                  isDashboard
                  board={board}
                  dividedBoardsCount={board.dividedBoards.length}
                  userId={userId}
                />
              ))}
            </Flex>
          </Flex>
        );
      })}

      {isLoading && (
        <Flex justify="center">
          <Dots />
        </Flex>
      )}
    </Flex>
  );
});

export default ListOfCards;
