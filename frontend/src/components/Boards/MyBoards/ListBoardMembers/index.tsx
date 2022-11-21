import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';

import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
import { User } from 'types/user/user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { TeamUserRoles } from 'utils/enums/team.user.roles';
import {
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from '../../../Board/Settings/styles';
import { FilterBoardMembers } from './FilterBoardMembers';
import { ScrollableContent } from './styles';

type ListUsersType = {
	user: User;
	role: TeamUserRoles | BoardUserRoles;
	_id?: string;
};

type ListBoardMembersProps = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	boardMembers: ListUsersType[];
};

const ListBoardMembers = ({ isOpen, setIsOpen, boardMembers }: ListBoardMembersProps) => {
	// References
	const scrollRef = useRef<HTMLDivElement>(null);
	const dialogContainerRef = useRef<HTMLSpanElement>(null);

	const responsible: User[] = boardMembers
		.filter((user) => user.role === BoardUserRoles.RESPONSIBLE)
		.map((user) => user.user);

	const members = boardMembers
		.filter((user) => user.role === BoardUserRoles.MEMBER)
		.map((user) => user.user);

	const stakeholders = boardMembers
		.filter((user) => user.role === BoardUserRoles.STAKEHOLDER)
		.map((user) => user.user);

	return (
		<StyledDialogContainer ref={dialogContainerRef}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<StyledDialogOverlay />
				<StyledDialogContent>
					<StyledDialogTitle>
						<Text heading="4">Board Members</Text>
						<DialogClose asChild>
							<StyledDialogCloseButton isIcon size="lg">
								<Icon css={{ color: '$primary400' }} name="close" size={24} />
							</StyledDialogCloseButton>
						</DialogClose>
					</StyledDialogTitle>
					<ScrollableContent direction="column" justify="start" ref={scrollRef}>
						{/* <Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
							Team Members
						</Text>
						<Flex
							css={{ flex: '1 1', px: '$32', width: '80%', pt: '$20' }}
							direction="column"
							gap={16}
						>
							{boardMembers.map((member) => (
								<Flex key={member._id} align="center">
									<Avatar
										key={`${member}-${member._id}-${Math.random()}`}
										colors={undefined}
										css={{ position: 'relative', mr: '$10' }}
										fallbackText={`${member.user.firstName[0]}${member.user.lastName[0]}`}
										size={32}
									/>
									<Text color="primary800" size="sm">
										{`${member.user.firstName} ${member.user.lastName}`}
									</Text>
								</Flex>
							))}
						</Flex> */}
						<FilterBoardMembers
							isResponsible
							role={BoardUserRoles.RESPONSIBLE}
							users={responsible}
						/>
						<FilterBoardMembers isMember role={BoardUserRoles.MEMBER} users={members} />
						<FilterBoardMembers
							isStakeholder
							role={BoardUserRoles.STAKEHOLDER}
							users={stakeholders}
						/>
					</ScrollableContent>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { ListBoardMembers };
