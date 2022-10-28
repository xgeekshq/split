import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
import {
	ButtonsContainer,
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from '../../../Board/Settings/styles';
import Button from '../../../Primitives/Button';
import Flex from '../../../Primitives/Flex';
import InputSearch from './SearchInput';
import { ButtonAddMember } from './styles';

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
};

const ListMembers = ({ isOpen, setIsOpen }: Props) => {
	const [searchMember, setSearchMember] = useState<string>('');

	// References
	const dialogContainerRef = useRef<HTMLSpanElement>(null);
	const submitBtnRef = useRef<HTMLButtonElement | null>(null);

	// Method to close dialog and reset switches state
	const handleClose = () => {
		setIsOpen(false);
	};

	/**
	 * Use Effect to submit the board settings form when press enter key
	 * (Note: Radix Dialog close when pressing enter)
	 */
	useEffect(() => {
		const element = dialogContainerRef?.current;

		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				event.preventDefault();

				if (submitBtnRef.current) {
					submitBtnRef.current.click();
				}
			}
		};

		element?.addEventListener('keydown', keyDownHandler);

		return () => element?.removeEventListener('keydown', keyDownHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
						<InputSearch
							currentValue={searchMember}
							icon="search"
							iconPosition="left"
							id="search"
							placeholder="Search member"
							handleChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								setSearchMember(event.target.value)
							}
						/>
					</Flex>
					<Text css={{ display: 'block', px: '$32', py: '$10' }} heading="4">
						Teams
					</Text>
					<ButtonsContainer gap={24} justify="end">
						<Button
							css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
							variant="primaryOutline"
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button css={{ marginRight: '$32', padding: '$16 $24' }} variant="primary">
							Save
						</Button>
					</ButtonsContainer>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { ListMembers };
