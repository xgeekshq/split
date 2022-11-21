import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';

import { ListUsersType } from 'components/CardBoard/CardAvatars';
import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
import {
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from '../../../Board/Settings/styles';
import Flex from '../../../Primitives/Flex';
import { ScrollableContent } from './styles';

type ListBoardMembersProps = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	boardMembers: ListUsersType[];
};

const ListBoardMembers = ({ isOpen, setIsOpen, boardMembers }: ListBoardMembersProps) => {
	// References
	const scrollRef = useRef<HTMLDivElement>(null);
	const dialogContainerRef = useRef<HTMLSpanElement>(null);

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
						<Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
							Team Members
						</Text>
						<Flex
							css={{ flex: '1 1', px: '$32', width: '80%' }}
							direction="column"
							gap={16}
						>
							{boardMembers.map((member) => (
								<Flex key={member._id} align="center" justify="between">
									<Text
										color="primary300"
										css={{ textAlign: 'left', width: '50%' }}
										size="sm"
									>
										{typeof member.user === 'object' &&
											`${member.user.firstName} ${member.user.lastName}`}
									</Text>

									<Text
										color="primary300"
										css={{ textAlign: 'left', width: '50%' }}
										size="sm"
									>
										{typeof member.user === 'object' && member.user.email}
									</Text>
								</Flex>
							))}
						</Flex>
					</ScrollableContent>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { ListBoardMembers };
