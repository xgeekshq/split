import React, { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { TailSpin } from "react-loader-spinner";
import { getBoardsRequest } from "../../api/boardService";
import { toastState } from "../../store/toast/atom/toast.atom";
import BoardType from "../../types/board/board";
import { ToastStateEnum } from "../../utils/enums/toast-types";
import CardBody from "../CardBoard/CardBody/CardBody";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import TeamHeader from "./TeamHeader";
import { Team } from "../../types/team/team";

interface MyBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
}

const MyBoards = React.memo<MyBoardsProps>(({ userId, isSuperAdmin }) => {
  const setToastState = useSetRecoilState(toastState);
  // const [filter, setFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchBoards = useInfiniteQuery(
    "boards",
    ({ pageParam = 0 }) => getBoardsRequest(pageParam),
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
          content: "Error getting the boards",
          type: ToastStateEnum.ERROR,
        });
      },
    }
  );

  const { data, isLoading } = fetchBoards;

  const currentDate = new Date().toDateString();

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
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  // const teamNames = Array.from(dataByTeamAndDate.teams.values()).map((team) => {
  //   return { value: team._id, label: team.name };
  // });

  return (
    <Flex
      ref={scrollRef}
      onScroll={onScroll}
      css={{ mt: "$24", height: "100vh", overflow: "scroll", pr: "$20" }}
      justify="start"
      direction="column"
    >
      {/* <FilterBoards setFilter={setFilter} teamNames={teamNames} filter={filter} /> */}
      {Array.from(dataByTeamAndDate.boardsTeamAndDate).map(([teamId, boardsOfTeam]) => {
        const { users } = Array.from(boardsOfTeam)[0][1][0];
        // if (filter !== "all" && teamId !== filter) return null;
        return (
          <Flex direction="column" key={teamId} css={{ mb: "$24" }}>
            <Flex
              direction="column"
              css={{
                position: "sticky",
                zIndex: "5",
                top: "-0.4px",
                backgroundColor: "$background",
              }}
            >
              <TeamHeader
                team={dataByTeamAndDate.teams.get(teamId)}
                users={users}
                userId={userId}
              />
            </Flex>
            <Flex direction="column" gap="16" css={{ overflow: "scroll", zIndex: "1" }}>
              {Array.from(boardsOfTeam).map(([date, boardsOfDay]) => {
                const formatedDate = new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <Flex direction="column" key={date}>
                    <Text
                      size="xs"
                      color="primary300"
                      css={{
                        position: "sticky",
                        zIndex: "5",
                        top: "-0.2px",
                        height: "$24",
                        backgroundColor: "$background",
                      }}
                    >
                      Last updated -{" "}
                      {date === currentDate ? `Today, ${formatedDate}` : formatedDate}
                    </Text>
                    {/* to be used on the full version -> <Flex justify="end" css={{ width: "100%" }}>
                      <Flex
                        css={{
                          position: "relative",
                          zIndex: "30",
                          "& svg": { size: "$16" },
                          right: 0,
                          top: "-22px",
                        }}
                        gap="8"
                      >
                        <PlusIcon size="16" />
                        <Text
                          heading="6"
                          css={{
                            width: "fit-content",
                            display: "flex",
                            alignItems: "center",
                            "@hover": {
                              "&:hover": {
                                cursor: "pointer",
                              },
                            },
                          }}
                        >
                          {!Array.from(dataByTeamAndDate.teams.keys()).includes(teamId)
                            ? "Add new personal board"
                            : "Add new team board"}
                        </Text>
                      </Flex>
                    </Flex> */}
                    <Flex gap="20" direction="column">
                      {boardsOfDay.map((board: BoardType) => (
                        <CardBody
                          key={board._id}
                          userId={userId}
                          board={board}
                          isDashboard={false}
                          dividedBoardsCount={board.dividedBoards.length}
                          isSAdmin={isSuperAdmin}
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

      {isLoading && (
        <Flex css={{ width: "100%", "& svg": { color: "black" } }} justify="center">
          <TailSpin color="#060D16" height={60} width={60} />
        </Flex>
      )}
    </Flex>
  );
});

export default MyBoards;
