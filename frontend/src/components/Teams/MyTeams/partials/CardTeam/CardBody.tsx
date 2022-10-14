import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import Tooltip from 'components/Primitives/Tooltip';
import { newBoardState } from 'store/board/atoms/board.atom';
import BoardType from 'types/board/board';
import ClickEvent from 'types/events/clickEvent';
import { Team } from 'types/team/team';
import CardTitle from './CardTitle';
import CardAvatars from 'components/CardBoard/CardAvatars';
import Separator from 'components/Primitives/Separator';
import CardEnd from './CardEnd';
import { useSession } from 'next-auth/react';

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

	span: {
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
	team: Team;
	index?: number;
};

const CardBody = React.memo<CardBodyProps>(({ userId, team, index }) => {
	const { data: session } = useSession();

	const isSAdmin = session?.isSAdmin;

	const { _id: id, name, users } = team;

	const userIsParticipating = useMemo(() => {
		return !!users.find((user) => user.user._id === userId);
	}, [users, userId]);

	const havePermissions = useMemo(() => {
		if (isSAdmin) {
			return true;
		}
		return false;
		const myUser = team.users.find((user) => String(user.user._id) === String(userId));
		//const myUserIsOwner = board.createdBy._id === userId;
		// if (
		//     team &&
		//     (myUser?.role === 'admin' || myUser?.role === 'stakeholder' || myUserIsOwner)
		// ) {
		//     return true;
		// }
		//return !!users.find((user) => user.role === 'owner');
	}, [isSAdmin, team, userId, users]);

	return (
		<Flex css={{ flex: '1 1 0' }} direction="column" gap="12">
			<Flex>
				<InnerContainer
					align="center"
					elevation="1"
					justify="between"
					css={{
						position: 'relative',
						flex: '1 1 0',
						py: '$22',
						maxHeight: '$76',
						ml: 0
					}}
				>
					<Flex align="center">
						<Flex align="center" gap="8">
							<Flex align="center" gap="8">
								<CardTitle teamId={id} title={team.name} />

								<Text color="primary300" size="sm">
									Members
								</Text>

								<CardAvatars
									listUsers={team.users}
									responsible={false}
									teamAdmins={false}
									userId={userId}
								/>

								<Separator
									orientation="vertical"
									css={{
										ml: '$8',
										backgroundColor: '$primary100',
										height: '$24 !important'
									}}
								/>

								<Text color="primary300" size="sm">
									Team admin
								</Text>

								<CardAvatars
									listUsers={team.users}
									responsible={false}
									teamAdmins={false}
									userId={userId}
								/>

								<Separator
									orientation="vertical"
									css={{
										ml: '$8',
										backgroundColor: '$primary100',
										height: '$24 !important'
									}}
								/>

								{/* {!isDashboard && !isSubBoard && countDividedBoards > 0 && (
									<CenterMainBoard
										countDividedBoards={countDividedBoards}
										handleOpenSubBoards={handleOpenSubBoards}
										openSubBoards={openSubBoards}
									/>
								)} */}
							</Flex>
						</Flex>
					</Flex>
					<CardEnd
						team={team}
						havePermissions={havePermissions}
						index={index}
						isTeam={true}
						isMember={false}
						userId={userId}
						userIsParticipating={userIsParticipating}
						userSAdmin={isSAdmin}
					/>
				</InnerContainer>
			</Flex>
		</Flex>
	);
});

export default CardBody;
