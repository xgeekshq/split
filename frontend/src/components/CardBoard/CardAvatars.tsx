import React, { useCallback, useMemo } from 'react';

import { bubbleColors } from 'styles/stitches/partials/colors/bubble.colors';

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
					.filter((user) => user.role === 'responsible')
					.map((user) => user.user);

			if (teamAdmins)
				return listUsers.filter((user) => user.role === 'admin').map((user) => user.user);

			if (stakeholders) {
				return listUsers
					.filter((user) => user.role === 'stakeholder')
					.map((user) => user.user);
			}

			return listUsers.reduce((acc: User[], userFound: ListUsersType) => {
				if ((userFound.user as User)._id === userId) {
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

		const getRandomColor = useCallback(() => {
			const keys = Object.keys(bubbleColors);
			const value = Math.floor(Math.random() * keys.length);
			return { bg: `$${keys[value]}`, fontColor: `$${bubbleColors[keys[value]]}` };
		}, []);

		const stakeholdersColors = useMemo(
			() => ({
				border: true,
				bg: 'white',
				fontColor: '$primary400'
			}),
			[]
		);

		const colors = useMemo(() => {
			const col = [];
			for (let i = 0; i < 3; i++) {
				col.push(stakeholders ? stakeholdersColors : getRandomColor());
			}
			return col;
		}, [getRandomColor, stakeholdersColors, stakeholders]);

		const renderAvatar = useCallback(
			(value: User | string, idx) => {
				if (typeof value === 'string') {
					return (
						<Avatar
							key={`${value}-${idx}-${Math.random()}`}
							css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
							size={32}
							colors={colors[idx]}
							fallbackText={value}
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
								css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
								size={32}
								colors={colors[idx]}
								fallbackText={initials}
							/>
						</div>
					</Tooltip>
				);
			},
			[colors]
		);

		return (
			<Flex align="center" css={{ height: 'fit-content', overflow: 'hidden' }}>
				{haveError
					? ['-', '-', '-'].map((value, index) => renderAvatar(value, index))
					: (data.slice(0, !myBoards ? 3 : 1) as User[]).map(
							(user: User, index: number) => {
								return renderAvatar(getInitials(user, index), index);
							}
					  )}
			</Flex>
		);
	}
);

export default CardAvatars;
