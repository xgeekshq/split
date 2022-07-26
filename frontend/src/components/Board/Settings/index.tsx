import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { Accordion } from '@radix-ui/react-accordion';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { deepClone } from 'fast-json-patch';

import { highlight2Colors } from 'styles/stitches/partials/colors/highlight2.colors';

import Icon from 'components/icons/Icon';
import Avatar from 'components/Primitives/Avatar';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import Separator from 'components/Primitives/Separator';
import { Switch, SwitchThumb } from 'components/Primitives/Switch';
import Text from 'components/Primitives/Text';
import useBoard from 'hooks/useBoard';
import SchemaUpdateBoard from 'schema/schemaUpdateBoardForm';
import { boardInfoState } from 'store/board/atoms/board.atom';
import { updateBoardDataState, updateBoardError } from 'store/updateBoard/atoms/update-board.atom';
import { BoardUserToAdd } from 'types/board/board.user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import isEmpty from 'utils/isEmpty';
import {
	ButtonsContainer,
	StyledAccordionContent,
	StyledAccordionHeader,
	StyledAccordionIcon,
	StyledAccordionItem,
	StyledAccordionTrigger,
	StyledDialogCloseButton,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from './styles';

const DEFAULT_MAX_VOTES = '6';

type ConfigurationSettingsProps = {
	title: string;
	text: string;
	isChecked: boolean;
	handleCheckedChange: (checked: boolean) => void;
	children?: ReactNode;
};

const ConfigurationSettings = ({
	title,
	text,
	isChecked,
	handleCheckedChange,
	children
}: ConfigurationSettingsProps) => (
	<Flex gap={20}>
		<Switch checked={isChecked} onCheckedChange={handleCheckedChange} variant="sm">
			<SwitchThumb variant="sm">
				{isChecked && (
					<Icon
						name="check"
						css={{
							width: '$10',
							height: '$10',
							color: '$successBase'
						}}
					/>
				)}
			</SwitchThumb>
		</Switch>
		<Flex direction="column">
			<Text size="md" weight="medium">
				{title}
			</Text>
			<Text size="sm" color="primary500">
				{text}
			</Text>
			{children}
		</Flex>
	</Flex>
);

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	socketId: string;
	isStakeholderOrAdmin?: boolean | undefined;
	isOwner?: boolean | undefined;
	isSAdmin?: boolean | undefined;
};

const BoardSettings = ({
	isOpen,
	setIsOpen,
	socketId,
	isStakeholderOrAdmin,
	isOwner,
	isSAdmin
}: Props) => {
	const submitBtnRef = useRef<HTMLButtonElement | null>(null);

	const [updateBoardData, setUpdateBoardData] = useRecoilState(updateBoardDataState);
	const haveError = useRecoilValue(updateBoardError);

	const [isMaxVotesChecked, setIsMaxVotesChecked] = useState(false);
	const [isUsersChecked, setIsUsersChecked] = useState(false);

	/**
	 * Atoms
	 */
	const boardData = useRecoilValue(boardInfoState);

	/**
	 * Get Board Info
	 */
	const { isSubBoard } = boardData!.board;

	/**
	 * User Board Hook
	 */
	const {
		updateBoard: { mutate }
	} = useBoard({ autoFetchBoard: false });
	const { board } = updateBoardData;

	/**
	 * Use Form Hook
	 */
	const methods = useForm<{ title: string; maxVotes: string | undefined }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		resolver: joiResolver(SchemaUpdateBoard),
		defaultValues: {
			title: '',
			maxVotes: undefined
		}
	});

	/**
	 * Use Effect to run when board change
	 * to set title and validate if
	 * the value of max votes is not undefined,
	 * if yes set the input with this value
	 */
	useEffect(() => {
		methods.setValue('title', board.title);
		methods.setValue('maxVotes', board.maxVotes);
		setIsMaxVotesChecked(!isEmpty(board.maxVotes));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [board]);

	const handleHideCardsChange = (checked: boolean) => {
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				hideCards: checked
			}
		}));
	};

	const handleHideVotesChange = (checked: boolean) => {
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				hideVotes: checked
			}
		}));
	};

	/**
	 * Handle the max votes switch change
	 */
	const handleMaxVotes = (checked: boolean) => {
		setIsMaxVotesChecked(checked);
		// Destructuring useForm hook
		const { register, setValue, clearErrors } = methods;

		/**
		 * When not checked reset the
		 * maxVotes value to undefined
		 */
		if (!checked) {
			clearErrors('maxVotes');
			setValue('maxVotes', 'undefined');

			setUpdateBoardData((prev) => ({
				...prev,
				board: {
					...prev.board,
					maxVotes: 'undefined'
				}
			}));

			return;
		}

		/**
		 * If checked,
		 * set with value from database
		 * or with default value (6)
		 */
		register('maxVotes');
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				maxVotes: isEmpty(board.maxVotes) ? DEFAULT_MAX_VOTES : board.maxVotes
			}
		}));
		setValue('maxVotes', isEmpty(board.maxVotes) ? DEFAULT_MAX_VOTES : board.maxVotes);
	};

	const updateBoard = (title: string, maxVotes: string | undefined) => {
		console.log('aqi', updateBoardData);
		mutate({
			board: {
				...updateBoardData.board,
				title,
				maxVotes,
				socketId
			}
		});
		setIsOpen(false);
		setIsUsersChecked(false);
	};

	/**
	 * Use Effect to submit the board settings form when press enter key
	 * (Note: Radix Dialog close when pressing enter)
	 */

	/** Team Responsible Change */
	const { users } = board;
	const responsible = users.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;
	const handleUsers = (checked: boolean) => {
		setIsUsersChecked(checked);
	};
	const handleLottery = () => {
		if (isUsersChecked) {
			const cloneUsers = [...deepClone(users)].map((user) => ({
				...user,
				role: BoardUserRoles.MEMBER
			}));

			// 	'update',
			let userFound: BoardUserToAdd | undefined;
			do {
				userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
			} while (userFound?.user._id === responsible?._id);

			if (!userFound) return;
			userFound.role = BoardUserRoles.RESPONSIBLE;

			setUpdateBoardData((prev) => ({
				...prev,
				board: {
					...prev.board,
					users: cloneUsers
				}
			}));
		}
	};

	useEffect(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				event.preventDefault();

				if (submitBtnRef.current) {
					submitBtnRef.current.click();
				}
			}
		};

		document.addEventListener('keydown', keyDownHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					css={{
						ml: 'auto'
					}}
					variant="primaryOutline"
				>
					<Icon name="settings" />
					Board settings
					<Icon name="arrow-down" />
				</Button>
			</DialogTrigger>
			<StyledDialogOverlay />
			<StyledDialogContent>
				<StyledDialogTitle>
					<h2>Board Settings</h2>
					<DialogClose asChild>
						<StyledDialogCloseButton size="lg" isIcon>
							<Icon name="close" css={{ color: '$primary400' }} size={24} />
						</StyledDialogCloseButton>
					</DialogClose>
				</StyledDialogTitle>
				<FormProvider {...methods}>
					<form
						onSubmit={methods.handleSubmit(({ title, maxVotes }) =>
							updateBoard(title, maxVotes)
						)}
					>
						<Flex direction="column" gap={16} css={{ padding: '$24 $32 $40' }}>
							<Text heading="4">Board Name</Text>
							<Input
								disabled={haveError}
								state="default"
								id="title"
								type="text"
								placeholder="Board Name"
								forceState
								maxChars="30"
							/>
						</Flex>
						<Text heading="4" css={{ display: 'block', px: '$32' }}>
							Board Settings
						</Text>
						<Accordion type="multiple">
							<StyledAccordionItem value="configurations" variant="first">
								<StyledAccordionHeader variant="first">
									<StyledAccordionTrigger>
										<Text heading="5">Configurations</Text>
										<StyledAccordionIcon name="arrow-down" />
									</StyledAccordionTrigger>
								</StyledAccordionHeader>
								<StyledAccordionContent>
									<Flex direction="column" gap={16}>
										<ConfigurationSettings
											text="Participants can not see the cards from other participants of this retrospective."
											title="Hide cards from others"
											isChecked={board.hideCards}
											handleCheckedChange={handleHideCardsChange}
										/>

										{!isSubBoard && (
											<>
												<ConfigurationSettings
													text="Participants can not see the votes from other participants of this retrospective."
													title="Hide votes from others"
													isChecked={board.hideVotes}
													handleCheckedChange={handleHideVotesChange}
												/>
												<ConfigurationSettings
													text="Make votes more significant by limiting them."
													title="Limit votes"
													isChecked={isMaxVotesChecked}
													handleCheckedChange={handleMaxVotes}
												>
													<Input
														id="maxVotes"
														name="maxVotes"
														type="number"
														css={{ mt: '$8' }}
														disabled={!isMaxVotesChecked}
														placeholder="Max votes"
														min={
															boardData!.board.totalUsedVotes === 0
																? 0
																: board.maxVotes
														}
													/>
												</ConfigurationSettings>
											</>
										)}
									</Flex>
								</StyledAccordionContent>
							</StyledAccordionItem>

							{isSubBoard && (isStakeholderOrAdmin || isOwner || isSAdmin) && (
								<StyledAccordionItem value="responsible">
									<StyledAccordionHeader>
										<StyledAccordionTrigger>
											<Text heading="5">Team Responsible</Text>
											<StyledAccordionIcon name="arrow-down" />
										</StyledAccordionTrigger>
									</StyledAccordionHeader>
									<StyledAccordionContent>
										<Flex direction="column" gap={16}>
											<ConfigurationSettings
												text="Change responsible participant for this board."
												title="Team Responsible"
												isChecked={isUsersChecked}
												handleCheckedChange={handleUsers}
											>
												<Flex align="center" css={{ mt: '$10' }}>
													<Text
														css={{
															mr: '$8',
															color: '$primary300'
														}}
													>
														Responsible Lottery
													</Text>
													<Separator
														orientation="vertical"
														css={{
															'&[data-orientation=vertical]': {
																height: '$12',
																width: 1
															}
														}}
													/>

													<Flex
														css={{
															height: '$24',
															width: '$24',
															borderRadius: '$round',
															border: '1px solid $colors$primary400',
															ml: '$12',
															cursor: isUsersChecked
																? 'pointer'
																: 'default',

															transition: 'all 0.2s ease-in-out',

															'&:hover': isUsersChecked
																? {
																		backgroundColor:
																			'$primary400',
																		color: 'white'
																  }
																: 'none'
														}}
														align="center"
														justify="center"
														onClick={handleLottery}
													>
														<Icon
															name="wand"
															css={{
																width: '$12',
																height: '$12'
															}}
														/>
													</Flex>

													<Text
														size="sm"
														color="primary800"
														css={{ mx: '$8' }}
													>
														{responsible?.firstName}{' '}
														{responsible?.lastName}
													</Text>

													<Avatar
														css={{ position: 'relative' }}
														size={32}
														colors={{
															bg: highlight2Colors.highlight2Lighter,
															fontColor:
																highlight2Colors.highlight2Dark
														}}
														fallbackText={`${responsible?.firstName[0]}${responsible?.lastName[0]}`}
													/>
												</Flex>
											</ConfigurationSettings>
										</Flex>
									</StyledAccordionContent>
								</StyledAccordionItem>
							)}
						</Accordion>
						<ButtonsContainer justify="end" gap={24}>
							<Button
								onClick={() => setIsOpen(false)}
								variant="primaryOutline"
								css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
							>
								Cancel
							</Button>
							<Button
								ref={submitBtnRef}
								type="submit"
								variant="primary"
								css={{ marginRight: '$32', padding: '$16 $24' }}
							>
								Save
							</Button>
						</ButtonsContainer>
					</form>
				</FormProvider>
			</StyledDialogContent>
		</Dialog>
	);
};

BoardSettings.defaultProps = {
	isOwner: false,
	isStakeholderOrAdmin: false,
	isSAdmin: false
};

ConfigurationSettings.defaultProps = {
	children: undefined
};

export { BoardSettings };
