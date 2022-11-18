import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from 'components/Primitives/Flex';
import { membersListState } from '../../../../store/team/atom/team.atom';
import { TeamUserRoles } from '../../../../utils/enums/team.user.roles';
import CardMember from '../../CreateTeam/CardMember';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
	const { data: session } = useSession({ required: true });
	const membersList = useRecoilValue(membersListState);

	const scrollRef = useRef<HTMLDivElement>(null);

	const user = membersList.find((member) => member.user._id === session?.user.id);

	const userRole = user?.role;

	return (
		<Flex css={{ mt: '$32' }} direction="column">
			<ScrollableContent direction="column" justify="start" ref={scrollRef}>
				{membersList?.map((member) => (
					<CardMember
						key={member.user._id}
						isTeamPage
						isNewJoiner={member.isNewJoiner}
						isTeamCreator={member.user._id === session?.user.id}
						member={member.user}
						role={member.role}
						isTeamMemberOrStakeholder={
							userRole === TeamUserRoles.MEMBER ||
							userRole === TeamUserRoles.STAKEHOLDER
						}
					/>
				))}
			</ScrollableContent>
		</Flex>
	);
};

export default TeamMembersList;
