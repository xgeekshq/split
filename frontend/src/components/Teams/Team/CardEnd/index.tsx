import React from 'react';

import Flex from 'components/Primitives/Flex';
import RoleDescription from '../../CreateTeam/CardEnd/RoleDescription';
import PopoverRoleSettings from '../../CreateTeam/CardMember/RoleSettings';

type CardEndTeamProps = {
	role: string;
	isTeamMemberOrStakeholder?: boolean;
	userId: string;
	isTeamCreator?: boolean;
};

const CardEndTeam = ({
	role,
	isTeamMemberOrStakeholder,
	userId,
	isTeamCreator
}: CardEndTeamProps) => {
	return (
		<Flex align="center" css={{ width: '$237' }} justify="end">
			<RoleDescription role={role} />
			{!isTeamMemberOrStakeholder && !isTeamCreator && (
				<PopoverRoleSettings userId={userId} />
			)}
		</Flex>
	);
};

export default CardEndTeam;
