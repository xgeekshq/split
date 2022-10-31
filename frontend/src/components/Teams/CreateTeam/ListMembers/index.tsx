import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
import { toastState } from '../../../../store/toast/atom/toast.atom';
import { User } from '../../../../types/user/user';
import { ToastStateEnum } from '../../../../utils/enums/toast-types';
import {
	ButtonsContainer,
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from '../../../Board/Settings/styles';
import Button from '../../../Primitives/Button';
import Checkbox from '../../../Primitives/Checkbox';
import Flex from '../../../Primitives/Flex';
import SearchInput from './SearchInput';
import { ButtonAddMember, ScrollableContent } from './styles';

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	users?: User[];
};

const ListMembers = ({ isOpen, setIsOpen, users }: Props) => {
	const [checked, setChecked] = useState<string[]>([]);
	const [searchMember, setSearchMember] = useState<string>('');

	const setToastState = useSetRecoilState(toastState);

	// References
	const scrollRef = useRef<HTMLDivElement>(null);
	const dialogContainerRef = useRef<HTMLSpanElement>(null);

	// Method to close dialog
	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchMember(event.target.value);
	};

	const handleChecked = (id: string) => {
		let updateIdList = [...checked];

		const isUserChecked = checked.some((value) => value === id);

		if (!isUserChecked) {
			updateIdList = [...checked, id];
		} else {
			updateIdList.splice(checked.indexOf(id), 1);
		}

		setChecked(updateIdList);
	};

	const saveMembers = () => {
		const listOfUsers: User[] | undefined = [];

		checked.forEach((id) => {
			const userFound = users?.find((user) => user._id === id);

			if (userFound) listOfUsers.push(userFound);
		});

		setToastState({
			open: true,
			content: 'Team member/s successfully added',
			type: ToastStateEnum.SUCCESS
		});

		setIsOpen(false);
	};

	const usersList = useMemo(() => {
		const list = users?.map((user) => {
			return { ...user, isChecked: false };
		});

		return list?.map((user) => {
			const userFound = checked.find((id) => user._id === id);

			if (userFound) return { ...user, isChecked: true };

			return user;
		});
	}, [checked, users]);

	return (
		<StyledDialogContainer ref={dialogContainerRef}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<ButtonAddMember>
						<Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
						<Text
							css={{
								ml: '$10',
								fontSize: '$14',
								lineHeight: '$18',
								fontWeight: '700'
							}}
						>
							Add new member
						</Text>
					</ButtonAddMember>
				</DialogTrigger>
				<StyledDialogOverlay />
				<StyledDialogContent>
					<StyledDialogTitle>
						<Text heading="4">Add team members</Text>
						<DialogClose asChild>
							<StyledDialogCloseButton isIcon size="lg">
								<Icon css={{ color: '$primary400' }} name="close" size={24} />
							</StyledDialogCloseButton>
						</DialogClose>
					</StyledDialogTitle>
					<Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
						<SearchInput
							currentValue={searchMember}
							handleChange={handleSearchChange}
							icon="search"
							iconPosition="left"
							id="search"
							placeholder="Search member"
						/>
					</Flex>
					<Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
						Teams
					</Text>
					<ScrollableContent direction="column" justify="start" ref={scrollRef}>
						<Flex
							css={{ flex: '1 1', pb: '$24', px: '$32', width: '80%' }}
							direction="column"
							gap={16}
						>
							{usersList?.map((user) => (
								<Flex key={user._id} align="center" justify="between">
									<Checkbox
										checked={user.isChecked}
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
						</Flex>
					</ScrollableContent>
					<ButtonsContainer gap={24} justify="end">
						<Button
							css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
							variant="primaryOutline"
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							css={{ marginRight: '$32', padding: '$16 $24' }}
							variant="primary"
							onClick={saveMembers}
						>
							Add
						</Button>
					</ButtonsContainer>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { ListMembers };
