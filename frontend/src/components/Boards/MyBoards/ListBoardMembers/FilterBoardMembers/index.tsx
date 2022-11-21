import React, { useMemo } from 'react';

import Avatar from 'components/Primitives/Avatar';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { User } from 'types/user/user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';

type FilterBoardMembersType = {
	role: BoardUserRoles;
	users: User[];
	isStakeholder?: boolean;
	isMember?: boolean;
	isResponsible?: boolean;
};

const FilterBoardMembers = ({
	role,
	users,
	isMember,
	isStakeholder,
	isResponsible
}: FilterBoardMembersType) => {
	const isPluralStakeholderOrResponsible = useMemo(() => {
		return (isStakeholder || isResponsible) && users.length > 1;
	}, [isStakeholder, isResponsible, users.length]);

	const isSingularStakeholderOrResponsible = useMemo(() => {
		return (isStakeholder || isResponsible) && users.length === 1;
	}, [isStakeholder, isResponsible, users.length]);

	return (
		<>
			<Text css={{ display: 'block', px: '$32', py: '$10', pt: '$20' }} heading="4">
				{isMember && `Team Members`}
				{isPluralStakeholderOrResponsible &&
					`${role[0].toUpperCase()}${role.substring(1, role.length)}s`}
				{isSingularStakeholderOrResponsible &&
					`${role[0].toUpperCase()}${role.substring(1, role.length)}`}
				{/* {role === 'member' && `Team ${role[0].toUpperCase()}${role.substring(1, role.length)}s`} */}
			</Text>
			<Flex
				css={{ flex: '1 1', px: '$32', width: '80%', pt: '$20' }}
				direction="column"
				gap={16}
			>
				{users.map((member) => (
					<Flex key={member._id} align="center">
						<Avatar
							key={`${member}-${member._id}-${Math.random()}`}
							colors={undefined}
							css={{ position: 'relative', mr: '$10' }}
							fallbackText={`${member.firstName[0]}${member.lastName[0]}`}
							size={32}
						/>
						<Text color="primary800" size="sm">
							{`${member.firstName} ${member.lastName}`}
						</Text>
					</Flex>
				))}
			</Flex>
		</>
	);
};

export { FilterBoardMembers };
