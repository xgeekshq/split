import React from 'react';
import { useSession } from 'next-auth/react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import CardMember from '../CardMember';

const TeamMembersList = () => {
	const { data: session } = useSession();

	return session ? (
		<Flex css={{ mt: '$48' }} direction="column">
			<Text css={{ mb: '$16' }} heading="3">
				Team Members
			</Text>
			<CardMember userId={session.user.id} userSAdmin={session.isSAdmin} />
		</Flex>
	) : null;
};

export default TeamMembersList;
