import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';

import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
// import { membersListState, usersListState } from '../../../../store/team/atom/team.atom';
import {
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from '../../../Board/Settings/styles';
import Flex from '../../../Primitives/Flex';
import { ScrollableContent } from './styles';

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
};

const ListMembers = ({ isOpen, setIsOpen }: Props) => {
	// const { data: session } = useSession({ required: true });
	// const [searchMember, setSearchMember] = useState<string>('');

	// const usersList = useRecoilValue(usersListState);
	// const membersList = useRecoilValue(membersListState);

	// const setToastState = useSetRecoilState(toastState);
	// const setMembersListState = useSetRecoilState(membersListState);
	// const setUsersListState = useSetRecoilState(usersListState);

	const usersList = [
		{
			_id: 1,
			firstName: 'Patrícia',
			lastName: 'Dias',
			email: 'patricia@mail.com'
		}
	];

	// References
	const scrollRef = useRef<HTMLDivElement>(null);
	const dialogContainerRef = useRef<HTMLSpanElement>(null);

	// // Method to close dialog
	// const handleClose = () => {
	// 	setIsOpen(false);
	// };

	// const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setSearchMember(event.target.value);
	// };

	// const handleChecked = (id: string) => {
	// 	const updateCheckedUser = usersList?.map((user) =>
	// 		user._id === id ? { ...user, isChecked: !user.isChecked } : user
	// 	);

	// 	setUsersListState(updateCheckedUser);
	// };

	// const filteredList = useMemo(() => {
	// 	const searchString = searchMember.toLowerCase();

	// 	return usersList.filter((user) => {
	// 		const firstName = user.firstName.toLowerCase();
	// 		const lastName = user.lastName.toLowerCase();
	// 		return (
	// 			firstName.includes(searchString) ||
	// 			lastName.includes(searchString) ||
	// 			searchMember === ''
	// 		);
	// 	});
	// }, [searchMember, usersList]);

	// const saveMembers = () => {
	// 	const listOfUsers = [...membersList];

	// 	// const addedUsers = usersList.filter((user) => user.isChecked);

	// 	const updatedListWithAdded = addedUsers.map((user) => {
	// 		return (
	// 			listOfUsers.find((member) => member.user._id === user._id) || {
	// 				user,
	// 				role: TeamUserRoles.MEMBER,
	// 				isNewJoiner: false
	// 			}
	// 		);
	// 	});

	// 	// this insures that the team creator stays always in first

	// 	const userAdminIndex = updatedListWithAdded.findIndex(
	// 		(member) => member.user._id === session?.user.id
	// 	);

	// 	updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

	// 	setToastState({
	// 		open: true,
	// 		content: 'Team member/s successfully added',
	// 		type: ToastStateEnum.SUCCESS
	// 	});

	// 	setMembersListState(updatedListWithAdded);

	// 	setIsOpen(false);
	// };

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
							{usersList.map((user) => (
								<Flex key={user._id} align="center" justify="between">
									{/* <Checkbox
										checked={user.isChecked}
										disabled={user._id === session?.user.id}
										handleChange={handleChecked}
										id={user._id}
										label={`${user.firstName} ${user.lastName}`}
										size="16"
									/> */}

									<Text
										color="primary300"
										css={{ textAlign: 'left', width: '50%' }}
										size="sm"
									>
										* {user.firstName} ${user.lastName}
									</Text>

									<Text
										color="primary300"
										css={{ textAlign: 'left', width: '50%' }}
										size="sm"
									>
										{user.email}
									</Text>
								</Flex>
							))}
						</Flex>
						{/* <Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
                            Team members
                        </Text>
						<Flex
							css={{ flex: '1 1', px: '$32', width: '80%' }}
							direction="column"
							gap={16}
						>
							{filteredList?.map((user) => (
								<Flex key={user._id} align="center" justify="between">
									<Checkbox
										checked={user.isChecked}
										disabled={user._id === session?.user.id}
										handleChange={handleChecked}
										id={user._id}
										label={`${user.firstName} ${user.lastName}`}
										size="16"
									/>

									<Text
										color="primary300"
										css={{ textAlign: 'left', width: '50%' }}
										size="sm"
									>
										{user.email}
									</Text>
								</Flex>
							))}
						</Flex> */}
					</ScrollableContent>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { ListMembers };
