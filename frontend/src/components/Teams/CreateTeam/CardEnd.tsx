import React from 'react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { TeamUserRoles } from '../../../utils/enums/team.user.roles';
import PopoverRoleSettings from './CardMember/RoleSettings';

type CardEndProps = {
	role: string;
	isTeamCreator?: boolean;
	userId: string;
};

const CardEnd = ({ role, isTeamCreator, userId }: CardEndProps) => {
	return (
		<Flex align="center" css={{ width: '23%' }} justify="end">
			<Text color="primary200" size="sm">
				Role |
			</Text>
			<Text color="primary800" css={{ mx: '$8' }} size="sm" weight="medium">
				{role === TeamUserRoles.STAKEHOLDER &&
					role.substring(0, 1).toUpperCase() + role.substring(1, role.length)}
				{(role === TeamUserRoles.ADMIN || role === TeamUserRoles.MEMBER) &&
					`Team ${role.substring(0, 1).toUpperCase()}${role.substring(1, role.length)}`}
			</Text>
			<PopoverRoleSettings isTeamCreator={isTeamCreator} userId={userId} />
		</Flex>
	);
};

export default CardEnd;
