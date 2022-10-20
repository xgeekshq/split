import React from 'react';
import { useSession } from 'next-auth/react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import AddMember from '../AddMember';
import CardMember from '../CardMember/CardMember';

const TeamMembersList = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<Flex css={{ mt: '$56' }} direction="column">
				<Text css={{ mb: '$16' }} heading="3">
					Team Members
				</Text>
				<CardMember userId={session?.user.id} userSAdmin={session?.isSAdmin} />
				<AddMember />
			</Flex>
		);
	}

	return null;
};

export default TeamMembersList;
