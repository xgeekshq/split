import React, { useCallback, useMemo } from 'react';

import Avatar from 'components/Primitives/Avatar';
import Flex from 'components/Primitives/Flex';
import Tooltip from 'components/Primitives/Tooltip';
import { User } from 'types/user/user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { TeamUserRoles } from 'utils/enums/team.user.roles';

type ListUsersType = {
	user: User | string;
	role: TeamUserRoles | BoardUserRoles;
	_id?: string;
};

type CardAvatarProps = {
	listUsers: ListUsersType[];
	responsible: boolean;
	teamAdmins: boolean;
	stakeholders?: boolean;
	userId: string;
	myBoards?: boolean;
	haveError?: boolean;
};

const CardAvatars = React.memo<CardAvatarProps>(
	({ listUsers, teamAdmins, stakeholders, userId, haveError, responsible, myBoards }) => {
		const data = useMemo(() => {
			if (responsible)
				return listUsers
					.filter((user) => user.role === BoardUserRoles.RESPONSIBLE)
					.map((user) => user.user);

			if (teamAdmins)
				return listUsers
					.filter((user) => user.role === TeamUserRoles.ADMIN)
					.map((user) => user.user);

			if (stakeholders) {
				return listUsers
					.filter((user) => user.role === TeamUserRoles.STAKEHOLDER)
					.map((user) => user.user);
			}

			return listUsers.reduce((acc: User[], userFound: ListUsersType) => {
				if ((userFound.user as User)?._id === userId) {
					acc.unshift(userFound.user as User);
				} else {
					acc.push(userFound.user as User);
				}
				return acc;
			}, []);
		}, [listUsers, responsible, teamAdmins, stakeholders, userId]);

		const usersCount = data.length;

		const getInitials = useCallback(
			(user: User | undefined, index) => {
				if (usersCount - 1 > index && index > 1) {
					return `+${usersCount - 2}`;
				}
				return user ?? '--';
			},
			[usersCount]
		);

		const stakeholdersColors = useMemo(
			() => ({
				border: true,
				bg: 'white',
				fontColor: '$primary400'
			}),
			[]
		);

		const renderAvatar = useCallback(
			(value: User | string, avatarColor, idx) => {
				if (typeof value === 'string') {
					return (
						<Avatar
							key={`${value}-${idx}-${Math.random()}`}
							colors={avatarColor}
							css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
							fallbackText={value}
							id={value}
							isDefaultColor={value === userId}
							size={32}
						/>
					);
				}

				const initials = `${value.firstName[0]}${value.lastName[0]}`;
				return (
					<Tooltip
						key={`${value}-${idx}-${Math.random()}`}
						content={`${value.firstName} ${value.lastName}`}
					>
						<div>
							<Avatar
								key={`${value}-${idx}-${Math.random()}`}
								colors={avatarColor}
								css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
								fallbackText={initials}
								id={value._id}
								isDefaultColor={value._id === userId}
								size={32}
							/>
						</div>
					</Tooltip>
				);
			},
			[userId]
		);

		return (
			<Flex align="center" css={{ height: 'fit-content', overflow: 'hidden' }}>
				{haveError
					? ['-', '-', '-'].map((value, index) => {
							return renderAvatar(
								value,
								stakeholders ? stakeholdersColors : undefined,
								index
							);
					  })
					: (data.slice(0, !myBoards ? 3 : 1) as User[]).map(
							(user: User, index: number) => {
								return renderAvatar(
									getInitials(user, index),
									stakeholders ? stakeholdersColors : undefined,
									index
								);
							}
					  )}
			</Flex>
		);
	}
);

export default CardAvatars;
