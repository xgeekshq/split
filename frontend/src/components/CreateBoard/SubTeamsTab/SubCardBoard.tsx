import React from 'react';
import { SetterOrUpdater } from 'recoil';
import { deepClone } from 'fast-json-patch';

import { highlight2Colors } from 'styles/stitches/partials/colors/highlight2.colors';
import { styled } from 'styles/stitches/stitches.config';

import CardAvatars from 'components/CardBoard/CardAvatars';
import LeftArrow from 'components/CardBoard/CardBody/LeftArrow';
import Icon from 'components/icons/Icon';
import Avatar from 'components/Primitives/Avatar';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import { CreateBoardData } from 'store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from 'types/board/board';
import { BoardUserToAdd } from 'types/board/board.user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';

interface SubCardBoardProps {
	index: number;
	board: BoardToAdd;
	setBoard: SetterOrUpdater<CreateBoardData>;
}

const Container = styled(Flex, Box, {});

const SubCardBoard: React.FC<SubCardBoardProps> = ({ board, index, setBoard }) => {
	const { users } = board;
	const responsible = users.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

	const handleLottery = () => {
		const cloneUsers = [...deepClone(users)].map((user) => ({
			...user,
			role: BoardUserRoles.MEMBER
		}));

		let userFound: BoardUserToAdd | undefined;
		do {
			userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
		} while (userFound?.user.email === responsible?.email);

		if (!userFound) return;
		userFound.role = BoardUserRoles.RESPONSIBLE;

		setBoard((prevBoard) => ({
			...prevBoard,
			board: {
				...prevBoard.board,
				dividedBoards: prevBoard.board.dividedBoards.map((boardFound, i) => {
					if (i === index) {
						return { ...boardFound, users: cloneUsers };
					}
					return boardFound;
				})
			}
		}));
	};

	return (
		<Flex css={{ flex: '1 1 0', width: '100%' }}>
			<LeftArrow isDashboard={false} index={index} />

			<Container
				elevation="1"
				align="center"
				justify="between"
				css={{
					backgroundColor: 'white',
					height: '$64',
					width: '100%',
					ml: '$40',
					py: '$16',
					pl: '$32',
					pr: '$24'
				}}
			>
				<Flex align="center">
					<Text heading="5">{board.title}</Text>
					<Flex align="center">
						<Text css={{ ml: '$40', mr: '$8' }}>Responsible Lottery</Text>
						<Separator
							orientation="vertical"
							css={{ '&[data-orientation=vertical]': { height: '$12', width: 1 } }}
						/>
						<Flex
							css={{
								height: '$24',
								width: '$24',
								borderRadius: '$round',
								border: '1px solid $colors$primary400',
								ml: '$12',
								cursor: 'pointer',

								transtion: 'all 0.2s ease-in-out',

								'&:hover': {
									backgroundColor: '$primary400',
									color: 'white'
								}
							}}
							align="center"
							justify="center"
							onClick={handleLottery}
						>
							<Icon
								name="wand"
								css={{
									width: '$12',
									height: '$12'
								}}
							/>
						</Flex>
						<Text size="sm" color="primary300" css={{ mx: '$8' }}>
							{responsible?.firstName} {responsible?.lastName}
						</Text>
						<Avatar
							css={{ position: 'relative' }}
							size={32}
							colors={{
								bg: highlight2Colors.highlight2Lighter,
								fontColor: highlight2Colors.highlight2Dark
							}}
							fallbackText={`${responsible?.firstName[0]}${responsible?.lastName[0]}`}
						/>
					</Flex>
				</Flex>
				<Flex align="center" gap="8">
					<Text size="sm">Sub team {index + 1}</Text>
					<CardAvatars
						listUsers={board.users}
						responsible={false}
						teamAdmins={false}
						userId="1"
					/>
				</Flex>
			</Container>
		</Flex>
	);
};

export default SubCardBoard;
