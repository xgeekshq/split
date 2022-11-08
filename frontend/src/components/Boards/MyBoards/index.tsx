import React, { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';

import { getBoardsRequest } from 'api/boardService';
import CardBody from 'components/CardBoard/CardBody/CardBody';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { useSocketBoardIO } from 'hooks/useSocketBoardIO';
import { toastState } from 'store/toast/atom/toast.atom';
import BoardType from 'types/board/board';
import { Team } from 'types/team/team';
import { ToastStateEnum } from 'utils/enums/toast-types';
import TeamHeader from '../TeamHeader';
import { ScrollableContent } from './styles';
import isEmpty from 'utils/isEmpty';
import EmptyBoards from 'components/Dashboard/RecentRetros/partials/EmptyBoards';

interface MyBoardsProps {
	userId: string;
	isSuperAdmin: boolean;
}

const MyBoards = React.memo<MyBoardsProps>(({ userId, isSuperAdmin }) => {
	const setToastState = useSetRecoilState(toastState);
	// const [filter, setFilter] = useState("all");
	const scrollRef = useRef<HTMLDivElement>(null);

	const fetchBoards = useInfiniteQuery(
		'boards',
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
					content: 'Error getting the boards',
					type: ToastStateEnum.ERROR
				});
			}
		}
	);

	const { data, isLoading } = fetchBoards;

	const teamSocketId = data?.pages[0].boards[0] ? data?.pages[0].boards[0].team._id : undefined;

	// socketId
	const { socket, queryClient } = useSocketBoardIO(teamSocketId);

	useEffect(() => {
		if (!socket) return;
		socket.on('teamId', () => {
			queryClient.invalidateQueries('boards');
		});
	}, [socket, queryClient]);

	const currentDate = new Date().toDateString();

	const dataByTeamAndDate = useMemo(() => {
		const teams = new Map<string, Team>();
		const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

		data?.pages.forEach((page) => {
			page.boards?.forEach((board) => {
				const boardsOfTeam = boardsTeamAndDate.get(`${board.team?._id ?? `personal`}`);
				const date = new Date(board.updatedAt).toDateString();
				if (!boardsOfTeam) {
					boardsTeamAndDate.set(
						`${board.team?._id ?? `personal`}`,
						new Map([[date, [board]]])
					);
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

	if (isEmpty(dataByTeamAndDate.boardsTeamAndDate.size)) {
		return <EmptyBoards />
	} 

	return (
		<ScrollableContent direction="column" justify="start" ref={scrollRef} onScroll={onScroll}>
			{/* <FilterBoards setFilter={setFilter} teamNames={teamNames} filter={filter} /> */}
			{Array.from(dataByTeamAndDate.boardsTeamAndDate).map(([teamId, boardsOfTeam]) => {
				const { users } = Array.from(boardsOfTeam)[0][1][0];
				// if (filter !== "all" && teamId !== filter) return null;
				return (
					<Flex key={teamId} css={{ mb: '$24' }} direction="column">
						<Flex
							direction="column"
							css={{
								position: 'sticky',
								zIndex: '5',
								top: '-0.4px',
								backgroundColor: '$background'
							}}
						>
							<TeamHeader
								team={dataByTeamAndDate.teams.get(teamId)}
								userId={userId}
								users={users}
							/>
						</Flex>
						<Flex css={{ zIndex: '1' }} direction="column" gap="16">
							{Array.from(boardsOfTeam).map(([date, boardsOfDay]) => {
								const formatedDate = new Date(date).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'short',
									day: 'numeric'
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
												backgroundColor: '$background'
											}}
										>
											Last updated -{' '}
											{date === currentDate
												? `Today, ${formatedDate}`
												: formatedDate}
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
				);
			})}

			{isLoading && <LoadingPage />}
		</ScrollableContent>
	);
});

export default MyBoards;
