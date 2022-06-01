import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { styled } from '../../../stitches.config';
import { newBoardState } from '../../../store/board/atoms/board.atom';
import BoardType from '../../../types/board/board';
import ClickEvent from '../../../types/events/clickEvent';
import Icon from '../../icons/Icon';
import Box from '../../Primitives/Box';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';
import Tooltip from '../../Primitives/Tooltip';
import CardAvatars from '../CardAvatars';
import CardIcon from '../CardIcon';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';
import CenterMainBoard from './CenterMainBoard';
import CountCards from './CountCards';
import LeftArrow from './LeftArrow';
import SubBoards from './SubBoards';

const InnerContainer = styled(Flex, Box, {
	px: '$32',
	backgroundColor: '$white',
	borderRadius: '$12'
});

const NewCircleIndicator = styled('div', {
	variants: {
		position: {
			absolute: {
				position: 'absolute',
				left: '$12',
				top: '50%',
				transform: 'translateY(-50%)'
			}
		}
	},
	width: '$8',
	height: '$8',
	borderRadius: '100%',
	backgroundColor: '$successBase'
});

const NewLabelIndicator = styled(Flex, {
	backgroundColor: '$successLightest',
	border: '1px solid $colors$successBase',
	borderRadius: '$pill',
	px: '$8',
	py: '$4',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '$4',

	'&>span': {
		fontSize: '$12',
		lineHeight: '$16',
		textTransform: 'uppercase',
		color: '$successBase'
	}
});

const RecurrentIconContainer = styled('div', {
	width: '$12',
	height: '$12',

	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',

	borderRadius: '$round',

	backgroundColor: '$primary800',
	color: 'white',

	cursor: 'pointer',

	svg: {
		width: '$8',
		height: '$8'
	}
});

type CardBodyProps = {
	userId: string;
	board: BoardType;
	index?: number;
	dividedBoardsCount: number;
	isDashboard: boolean;
	mainBoardId?: string;
	isSAdmin?: boolean;
};

const CardBody = React.memo<CardBodyProps>(
	({ userId, board, index, isDashboard, dividedBoardsCount, mainBoardId, isSAdmin }) => {
		const { _id: id, columns, users, team, dividedBoards, isSubBoard } = board;
		const countDividedBoards = dividedBoardsCount || dividedBoards.length;
		const [openSubBoards, setSubBoardsOpen] = useState(true);

		const newBoard = useRecoilValue(newBoardState);

		const isANewBoard = newBoard?._id === board._id;

		const userIsParticipating = useMemo(() => {
			return !!users.find((user) => user.user._id === userId);
		}, [users, userId]);

		const userIsAdmin = useMemo(() => {
			if (isSAdmin) return true;
			if (team) {
				return !!team.users.find((user) => user.role === 'admin');
			}
			return !!users.find((user) => user.role === 'owner');
		}, [isSAdmin, team, users]);

		const handleOpenSubBoards = (e: ClickEvent<HTMLDivElement, MouseEvent>) => {
			e.preventDefault();
			setSubBoardsOpen(!openSubBoards);
		};

		const renderCardBody = useCallback(
			(subBoard: BoardType, idx: number) => {
				return (
					<CardBody
						key={subBoard._id}
						board={subBoard}
						userId={userId}
						index={idx}
						isDashboard={isDashboard}
						dividedBoardsCount={countDividedBoards}
						mainBoardId={board._id}
					/>
				);
			},
			[board._id, countDividedBoards, isDashboard, userId]
		);

		return (
			<Flex direction="column" css={{ flex: '1 1 0' }} gap="12">
				<Flex>
					{isSubBoard && <LeftArrow isDashboard={isDashboard} index={index} />}

					<InnerContainer
						justify="between"
						align="center"
						elevation="1"
						css={{
							position: 'relative',
							flex: '1 1 0',
							py: !isSubBoard ? '$22' : '$16',
							maxHeight: isSubBoard ? '$64' : '$76',
							ml: isSubBoard ? '$40' : 0
						}}
					>
						{isANewBoard && <NewCircleIndicator position="absolute" />}
						<Flex align="center">
							<Flex gap="8" align="center">
								{!isSubBoard && (
									<CardIcon
										board={board}
										isParticipating={userIsParticipating}
										toAdd={false}
									/>
								)}
								<Flex align="center" gap="8">
									<CardTitle
										userIsParticipating={userIsParticipating}
										boardId={id}
										title={board.title}
										isSubBoard={isSubBoard}
										mainBoardId={mainBoardId}
									/>
									{isSubBoard && (
										<Text size="xs" color="primary300">
											of {dividedBoardsCount}
										</Text>
									)}
									{!userIsParticipating && !isDashboard && (
										<Icon
											name="lock"
											css={{
												color: '$primary300',
												width: '17px',
												height: '$16'
											}}
										/>
									)}
									{board.recurrent && (
										<Tooltip content="Recurrs every X week">
											<RecurrentIconContainer>
												<Icon name="recurring" />
											</RecurrentIconContainer>
										</Tooltip>
									)}

									{!isDashboard && isSubBoard && (
										<CardAvatars
											listUsers={!team ? users : team.users}
											responsible={false}
											teamAdmins={false}
											userId={userId}
										/>
									)}
									{!isDashboard && !isSubBoard && countDividedBoards > 0 && (
										<CenterMainBoard
											countDividedBoards={countDividedBoards}
											handleOpenSubBoards={handleOpenSubBoards}
											openSubBoards={openSubBoards}
										/>
									)}
								</Flex>
							</Flex>
							{isDashboard && <CountCards columns={columns} />}
						</Flex>
						{isANewBoard && (
							<NewLabelIndicator>
								<NewCircleIndicator />
								<span>New Board</span>
							</NewLabelIndicator>
						)}
						<CardEnd
							board={board}
							isDashboard={isDashboard}
							isSubBoard={isSubBoard}
							index={index}
							userIsAdmin={userIsAdmin}
							userId={userId}
							userSAdmin={isSAdmin}
						/>
					</InnerContainer>
				</Flex>
				{(openSubBoards || isDashboard) && (
					<SubBoards
						isDashboard={isDashboard}
						isSubBoard={isSubBoard}
						dividedBoards={dividedBoards}
						userId={userId}
						renderCardBody={renderCardBody}
					/>
				)}
			</Flex>
		);
	}
);

export default CardBody;
