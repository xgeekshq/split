import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from 'components/Primitives/Flex';
import { membersListState } from '../../../../store/team/atom/team.atom';
import CardMember from '../../CreateTeam/CardMember';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
	const { data: session } = useSession({ required: true });
	const membersList = useRecoilValue(membersListState);

	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<Flex css={{ mt: '$32' }} direction="column">
			<ScrollableContent direction="column" justify="start" ref={scrollRef}>
				{membersList?.map((member) => (
					<CardMember
						key={member.user._id}
						isTeamMember
						isNewJoiner={member.isNewJoiner}
						isTeamCreator={member.user._id === session?.user.id}
						member={member.user}
						membersList={membersList}
						role={member.role}
					/>
				))}
			</ScrollableContent>
		</Flex>
	);
};

export default TeamMembersList;
