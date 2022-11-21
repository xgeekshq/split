import React from 'react';

import Avatar from 'components/Primitives/Avatar';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { User } from 'types/user/user';

type FilterBoardMembersProps = {
	title: string;
	users: User[];
};

const FilterBoardMembers = ({ title, users }: FilterBoardMembersProps) => {
	return (
		<Flex align="start" css={{ pb: '$20' }} direction="column">
			<Text css={{ display: 'block', px: '$32', py: '$10', pt: '$20' }} heading="4">
				{title}
			</Text>
			<Flex css={{ px: '$32', py: '$10' }} direction="column" gap={16}>
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
		</Flex>
	);
};

export { FilterBoardMembers };
