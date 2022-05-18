import React, { useMemo, useRef } from "react";
import { TailSpin } from "react-loader-spinner";
import { InfiniteData, UseInfiniteQueryResult } from "react-query";
import BoardType from "../../../types/board/board";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import CardBody from "../../CardBoard/CardBody/CardBody";
import { styled } from "../../../stitches.config";

const LastUpdatedText = styled(Text, {
  position: "sticky",
  zIndex: "5",
  top: "-0.2px",
  height: "$24",
  backgroundColor: "$background",
});

type ListOfCardsProp = {
  data: InfiniteData<{ boards: BoardType[]; hasNextPage: boolean }>;
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
    data.pages.forEach((p) => {
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
  }, [data.pages]);

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
      ref={scrollRef}
      onScroll={onScroll}
      css={{ mt: "$24", height: "100%", pr: "$20" }}
      justify="start"
      direction="column"
      gap="24"
    >
      {Array.from(boardsSplitedByDay).map(([date, splitedBoard]) => {
        const formatedDate = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <Flex key={date} direction="column" gap="8">
            <LastUpdatedText size="xs" color="primary300">
              Last updated - {date === currentDate ? `Today, ${formatedDate}` : formatedDate}
            </LastUpdatedText>
            <Flex gap="20" direction="column">
              {splitedBoard.map((board: BoardType) => (
                <CardBody
                  userId={userId}
                  key={board._id}
                  board={board}
                  isDashboard
                  dividedBoardsCount={board.dividedBoards.length}
                />
              ))}
            </Flex>
          </Flex>
        );
      })}
      <Flex css={{ width: "100%", "& svg": { color: "black" } }} justify="center">
        {isLoading && <TailSpin color="#060D16" height={60} width={60} />}
      </Flex>
    </Flex>
  );
});

export default ListOfCards;
