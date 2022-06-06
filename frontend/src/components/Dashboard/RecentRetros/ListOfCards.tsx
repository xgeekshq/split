import React, { useMemo, useRef } from 'react';
import { InfiniteData, UseInfiniteQueryResult } from 'react-query';

import { styled } from 'styles/stitches/stitches.config';

import CardBody from 'components/CardBoard/CardBody/CardBody';
import LoadingPage from 'components/loadings/LoadingPage';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import BoardType from 'types/board/board';

const LastUpdatedText = styled(Text, {
	position: 'sticky',
	zIndex: '5',
	top: '-0.2px',
	height: '$24',
	backgroundColor: '$background'
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
			css={{ mt: '$24', height: 'calc(100vh - 450px)', overflow: 'auto', pr: '$10' }}
			justify="start"
			direction="column"
			gap="24"
		>
			{Array.from(boardsSplitedByDay).map(([date, splitedBoard]) => {
				const formatedDate = new Date(date).toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
				return (
					<Flex key={date} direction="column" gap="8">
						<LastUpdatedText size="xs" color="primary300">
							Last updated -{' '}
							{date === currentDate ? `Today, ${formatedDate}` : formatedDate}
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

			{isLoading && <LoadingPage />}
		</Flex>
	);
});

export default ListOfCards;
