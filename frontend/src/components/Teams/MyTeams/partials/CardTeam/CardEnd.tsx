import React, { useMemo } from 'react';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import BoardType from 'types/board/board';
import CardAvatars from 'components/CardBoard/CardAvatars';
import DeleteTeam from './DeleteBoard';
import { Team } from 'types/team/team';

type CardEndProps = {
	team: Team;
	isTeam: boolean;
	isMember: boolean | undefined;
	index: number | undefined;
	havePermissions: boolean;
	userId: string;
	userSAdmin?: boolean;
	userIsParticipating: boolean;
};

const CardEnd: React.FC<CardEndProps> = React.memo(
	({ team, isTeam, isMember, index, havePermissions, userId, userSAdmin = undefined }) => {
		CardEnd.defaultProps = {
			userSAdmin: undefined
		};
		const { _id: id, users, name } = team;

		// const boardTypeCaption = useMemo(() => {
		// 	if (isSubBoard && !isDashboard) return 'Responsible';
		// 	if (isSubBoard && !team && isDashboard) return 'Team';
		// 	if (team) return 'Team';
		// 	return 'Personal';
		// }, [isDashboard, isSubBoard, team]);

		// const boardOwnerName = useMemo(() => {
		// 	if (team) {
		// 		return team?.name;
		// 	}
		// 	if (isSubBoard && isDashboard && index !== undefined) {
		// 		return `sub-team ${index + 1}`;
		// 	}
		// 	if (isSubBoard && !isDashboard) {
		// 		return users.find((user) => user.role === 'responsible')?.user.firstName;
		// 	}

		// 	return createdBy?.firstName;
		// }, [team, isSubBoard, isDashboard, createdBy?.firstName, index, users]);

		if (isMember) {
			return (
				<Flex align="center" css={{ justifySelf: 'end' }}>
					{/* <Text color="primary300" size="sm">
						{boardTypeCaption} |
					</Text>
					<Text color="primary800" css={{ mx: '$8' }} size="sm" weight="medium">
						{boardOwnerName}
					</Text>
					<CardAvatars
						listUsers={!team ? users : team.users}
						responsible={false}
						teamAdmins={false}
						userId={userId}
					/> */}
				</Flex>
			);
		}

		if (!isMember) {
			return (
				<Flex css={{ alignItems: 'center' }}>
					{(havePermissions || userSAdmin) && !isMember && (
						<Flex align="center" css={{ ml: '$24' }} gap="24">
							<Separator
								orientation="vertical"
								css={{
									ml: '$8',
									backgroundColor: '$primary100',
									height: '$24 !important'
								}}
							/>

							<DeleteTeam teamId={id} teamName={name} />
						</Flex>
					)}
				</Flex>
			);
		}
		return null;
	}
);

export default CardEnd;
