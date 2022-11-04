import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { membersListState } from '../../../../store/team/atom/team.atom';
import CardMember from '../CardMember';
import { ListMembers } from '../ListMembers';
import { ScrollableContent } from './styles';

const TeamMembersList = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [containerHeight, setContainerHeight] = useState<number | null | undefined>(null);

	const { data: session } = useSession({ required: true });
	const membersList = useRecoilValue(membersListState);

	const scrollRef = useRef<HTMLDivElement>(null);

	const handleScroll = () => {
		setContainerHeight(scrollRef.current?.scrollHeight);
	};

	return (
		<Flex css={{ mt: '$38' }} direction="column">
			<Flex>
				<Text css={{ mb: '$16' }} heading="3">
					Team Members
				</Text>
				{containerHeight && containerHeight > window.innerHeight - 500 ? (
					<ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
				) : null}
			</Flex>
			<ScrollableContent
				direction="column"
				justify="start"
				ref={scrollRef}
				onScroll={handleScroll}
			>
				{membersList?.map((member) => (
					<CardMember
						key={member.user._id}
						member={member.user}
						role={member.role}
						userSAdmin={session?.isSAdmin}
					/>
				))}
				<ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
			</ScrollableContent>
		</Flex>
	);
};

export default TeamMembersList;
