import React, { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';

import { styled } from 'styles/stitches/stitches.config';

import CardAvatars from 'components/CardBoard/CardAvatars';
import Icon from 'components/icons/Icon';
import Box from 'components/Primitives/Box';
import Checkbox from 'components/Primitives/Checkbox';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import Tooltip from 'components/Primitives/Tooltip';
import useCreateBoard from 'hooks/useCreateBoard';
import { CreateBoardData, createBoardError } from 'store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from 'types/board/board';
import { Team } from 'types/team/team';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { TeamUserRoles } from '../../../utils/enums/team.user.roles';
import SubCardBoard from './SubCardBoard';

const MainContainer = styled(Flex, Box, {
	backgroundColor: 'white',
	height: '$76',
	width: '100%',
	borderRadius: '$12',
	px: '$24',
	py: '$22'
});

interface SubBoardListProp {
	dividedBoards: BoardToAdd[];
	setBoard: SetterOrUpdater<CreateBoardData>;
}

interface MainBoardCardInterface {
	team: Team;
	timesOpen: number;
}

const SubBoardList = React.memo(({ dividedBoards, setBoard }: SubBoardListProp) => {
	return (
		<Flex css={{ mb: '$50' }} direction="column" gap="8">
			{dividedBoards.map((subBoard, index) => (
				<SubCardBoard
					key={subBoard.title}
					index={index}
					board={subBoard}
					setBoard={setBoard}
				/>
			))}
		</Flex>
	);
});

const MainBoardCard = React.memo(({ team, timesOpen }: MainBoardCardInterface) => {
	/**
	 * Recoil Atoms
	 */
	const [haveError, setHaveError] = useRecoilState(createBoardError);

	const {
		handleAddTeam,
		handleRemoveTeam,
		handleSplitBoards,
		createBoardData: { board },
		setCreateBoardData,
		canAdd,
		canReduce,
		teamMembers
	} = useCreateBoard(team);

	const slackGroupHandler = () => {
		setCreateBoardData((prev) => ({
			...prev,
			board: { ...prev.board, slackGroup: !board.slackGroup }
		}));
	};

	const teamMembersCount = teamMembers?.length ?? 0;

	useEffect(() => {
		if (teamMembersCount < 4 && board.dividedBoards.length) {
			setHaveError(true);
			return;
		}

		const maxUsersCount = Math.ceil(teamMembersCount / 2);
		const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

		const users = team.users.flatMap((teamUser) => {
			if (teamUser.role !== TeamUserRoles.STAKEHOLDER) return [];
			return [
				{
					user: teamUser.user._id,
					role: BoardUserRoles.MEMBER,
					votesCount: 0
				}
			];
		});

		if (timesOpen < 2) {
			setCreateBoardData((prev) => ({
				...prev,
				users,
				board: { ...prev.board, dividedBoards: handleSplitBoards(2) },
				count: {
					...prev.count,
					teamsCount,
					maxUsersCount
				}
			}));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Flex direction="column" gap="8" css={{ width: '100%', height: '100%' }}>
			<MainContainer elevation="1" justify="between" align="center">
				<Flex>
					<Flex align="center" gap="8">
						<Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
							<div>
								<Icon css={{ width: '31px', height: '$32' }} name="blob-split" />
							</div>
						</Tooltip>
						<Text heading="6">{board.title}</Text>
					</Flex>
					<Flex css={{ ml: '$40' }} align="center">
						<Text size="sm" color="primary300" css={{ mr: '$8' }}>
							Sub-teams/-boards
						</Text>
						<Separator
							orientation="vertical"
							css={{ '&[data-orientation=vertical]': { height: '$12', width: 1 } }}
						/>
						<Text css={{ ml: '$8' }}>{board.dividedBoards.length}</Text>
						<Flex css={{ ml: '$12' }} gap="4">
							<Flex
								onClick={handleRemoveTeam}
								align="center"
								justify="center"
								css={{
									width: '$24',
									height: '$24',
									borderRadius: '$round',
									border: `1px solid ${
										!canReduce ? '$colors$primary200' : '$colors$primary400'
									}`,
									color: !canReduce ? '$colors$primary200' : '$colors$primary400',
									transition: 'all 0.2s ease-in-out',

									'&:hover': {
										cursor: canReduce ? 'pointer' : 'default',
										backgroundColor: canReduce ? '$primary100' : 'white'
									}
								}}
							>
								<Icon
									name="minus"
									css={{
										width: '$10',
										height: '$1'
									}}
								/>
							</Flex>
							<Flex
								onClick={handleAddTeam}
								align="center"
								justify="center"
								css={{
									width: '$24',
									height: '$24',
									borderRadius: '$round',
									border: `1px solid ${!canAdd ? '$primary200' : '$primary400'}`,
									color: !canAdd ? '$primary200' : '$primary400',
									transition: 'all 0.2s ease-in-out',

									'&:hover': {
										cursor: canAdd ? 'pointer' : 'default',
										backgroundColor: canAdd ? '$primary100' : 'white'
									}
								}}
							>
								<Icon
									name="plus"
									css={{
										width: '$12',
										height: '$12'
									}}
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex gap="8" align="center">
					<Text weight="medium" size="sm">
						{team.name}
					</Text>
					<CardAvatars
						haveError={haveError}
						listUsers={team.users}
						responsible={false}
						teamAdmins={false}
						userId="1"
					/>
				</Flex>
			</MainContainer>
			<SubBoardList dividedBoards={board.dividedBoards} setBoard={setCreateBoardData} />
			<Box onClick={slackGroupHandler}>
				<Checkbox
					checked={board.slackGroup}
					id="slack"
					label="Create Slack group for each sub-team"
					size="16"
				/>
			</Box>
		</Flex>
	);
});

export default MainBoardCard;
