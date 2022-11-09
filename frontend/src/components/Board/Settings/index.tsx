import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { Accordion } from '@radix-ui/react-accordion';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { deepClone } from 'fast-json-patch';

import Icon from 'components/icons/Icon';
import Avatar from 'components/Primitives/Avatar';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import useBoard from 'hooks/useBoard';
import SchemaUpdateBoard from 'schema/schemaUpdateBoardForm';
import { boardInfoState } from 'store/board/atoms/board.atom';
import { UpdateBoardType } from 'types/board/board';
import { BoardUserToAdd } from 'types/board/board.user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { getInitials } from 'utils/getInitials';
import isEmpty from 'utils/isEmpty';
import { ConfigurationSettings } from './partials/ConfigurationSettings';
import {
	ButtonsContainer,
	StyledAccordionContent,
	StyledAccordionHeader,
	StyledAccordionIcon,
	StyledAccordionItem,
	StyledAccordionTrigger,
	StyledDialogCloseButton,
	StyledDialogContainer,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
} from './styles';

const DEFAULT_MAX_VOTES = 6;

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	socketId: string;
	isStakeholderOrAdmin?: boolean | undefined;
	isOwner?: boolean | undefined;
	isSAdmin?: boolean | undefined;
	isResponsible: boolean;
};

const BoardSettings = ({
	isOpen,
	setIsOpen,
	socketId,
	isStakeholderOrAdmin,
	isOwner,
	isSAdmin,
	isResponsible
}: Props) => {
	// Recoil State used on [boardId].tsx
	const { board } = useRecoilValue(boardInfoState);

	// State used to change values
	const initialData: UpdateBoardType = {
		_id: board?._id,
		hideCards: board?.hideCards,
		hideVotes: board?.hideVotes,
		title: board?.title,
		maxVotes: board?.maxVotes,
		users: board?.users
	};
	const [data, setData] = useState<UpdateBoardType>(initialData);

	// References
	const dialogContainerRef = useRef<HTMLSpanElement>(null);
	const submitBtnRef = useRef<HTMLButtonElement | null>(null);

	// Unique state to handle the switches change
	const [switchesState, setSwitchesState] = useState<{ maxVotes: boolean; responsible: boolean }>(
		{
			maxVotes: false,
			responsible: false
		}
	);

	// User Board Hook
	const {
		updateBoard: { mutate }
	} = useBoard({ autoFetchBoard: false });

	const responsible = data.users?.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

	// Use Form Hook
	const methods = useForm<{ title: string; maxVotes?: number | null }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		resolver: joiResolver(SchemaUpdateBoard),
		defaultValues: {
			title: data.title,
			maxVotes: data.maxVotes
		}
	});

	// Method to close dialog and reset switches state
	const handleClose = () => {
		setIsOpen(false);
		setData(initialData);
		setSwitchesState({
			maxVotes: false,
			responsible: false
		});
	};

	/**
	 * Use Effect to run when board change
	 * to set title and validate if
	 * the value of max votes is not undefined,
	 * if yes set the input with this value
	 */
	useEffect(() => {
		setData((prev) => ({
			...prev,
			title: board?.title,
			maxVotes: board?.maxVotes
		}));
		methods.setValue('title', board.title);
		methods.setValue('maxVotes', board.maxVotes ?? null);

		setSwitchesState((prev) => ({ ...prev, maxVotes: !isEmpty(data.maxVotes) }));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [board]);

	const handleHideCardsChange = (checked: boolean) => {
		setData((prev) => ({
			...prev,
			hideCards: checked
		}));
	};

	const handleHideVotesChange = (checked: boolean) => {
		setData((prev) => ({
			...prev,
			hideVotes: checked
		}));
	};

	// Handle the max votes switch change
	const handleMaxVotesChange = (checked: boolean) => {
		setSwitchesState((prev) => ({ ...prev, maxVotes: checked }));

		// Destructuring useForm hook
		const { register, setValue, clearErrors } = methods;

		const value = isEmpty(data.maxVotes) ? DEFAULT_MAX_VOTES : data.maxVotes;

		setData((prev) => ({
			...prev,
			maxVotes: checked ? value : null
		}));

		if (!checked) {
			clearErrors('maxVotes');
			setValue('maxVotes', null);
		} else {
			register('maxVotes');
			setValue('maxVotes', value);
		}
	};

	const updateBoard = (title: string, maxVotes?: number | null) => {
		mutate(
			{
				...data,
				title,
				maxVotes,
				socketId
			},
			{
				onSuccess: () => setSwitchesState({ maxVotes: false, responsible: false })
			}
		);
		setIsOpen(false);
	};

	// Responsible Switch Change
	const handleResponsibleChange = (checked: boolean) => {
		setSwitchesState((prev) => ({
			...prev,
			responsible: checked
		}));
	};

	// Method to generate a random responsible
	const handleRandomResponsible = () => {
		if (switchesState.responsible) {
			const cloneUsers = [...deepClone(data.users)].map((user) => ({
				...user,
				role: BoardUserRoles.MEMBER
			}));

			let userFound: BoardUserToAdd | undefined;

			do {
				userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
			} while (userFound?.user._id === responsible?._id);

			if (!userFound) return;

			userFound.role = BoardUserRoles.RESPONSIBLE;

			setData((prev) => ({
				...prev,
				users: cloneUsers
			}));
		}
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

	const isSubBoard = board.boardNumber !== 0;

	return (
		<StyledDialogContainer ref={dialogContainerRef}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant="primaryOutline">
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
							<StyledDialogCloseButton isIcon size="lg">
								<Icon css={{ color: '$primary400' }} name="close" size={24} />
							</StyledDialogCloseButton>
						</DialogClose>
					</StyledDialogTitle>
					<FormProvider {...methods}>
						<form
							onSubmit={methods.handleSubmit(({ title, maxVotes }) =>
								updateBoard(title, maxVotes)
							)}
						>
							<Flex css={{ padding: '$24 $32 $40' }} direction="column" gap={16}>
								<Text heading="4">Board Name</Text>
								<Input
									forceState
									id="title"
									maxChars="30"
									placeholder="Board Name"
									state="default"
									type="text"
								/>
							</Flex>

							<Text css={{ display: 'block', px: '$32' }} heading="4">
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
												handleCheckedChange={handleHideCardsChange}
												isChecked={data.hideCards}
												text="Participants can not see the cards from other participants of this retrospective."
												title="Hide cards from others"
											/>

											{!isSubBoard && (
												<>
													<ConfigurationSettings
														handleCheckedChange={handleHideVotesChange}
														isChecked={data.hideVotes}
														text="Participants can not see the votes from other participants of this retrospective."
														title="Hide votes from others"
													/>
													<ConfigurationSettings
														handleCheckedChange={handleMaxVotesChange}
														isChecked={switchesState.maxVotes}
														text="Make votes more significant by limiting them."
														title="Limit votes"
													>
														<Input
															css={{ mt: '$8' }}
															disabled={!switchesState.maxVotes}
															id="maxVotes"
															name="maxVotes"
															placeholder="Max votes"
															type="number"
														/>
													</ConfigurationSettings>
												</>
											)}
										</Flex>
									</StyledAccordionContent>
								</StyledAccordionItem>

								{isSubBoard &&
									(isStakeholderOrAdmin ||
										isOwner ||
										isSAdmin ||
										isResponsible) && (
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
														isChecked={switchesState.responsible}
														text="Change responsible participant for this board."
														title="Team Responsible"
														handleCheckedChange={
															handleResponsibleChange
														}
													>
														<Flex
															align="center"
															css={{
																mt: '$10',
																opacity: !switchesState.responsible
																	? '40%'
																	: 'unset',
																pointerEvents:
																	!switchesState.responsible
																		? 'none'
																		: 'unset',
																transition: 'all 0.25s ease-in-out'
															}}
														>
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
																	'&[data-orientation=vertical]':
																		{
																			height: '$12',
																			width: 1
																		}
																}}
															/>

															<Flex
																align="center"
																justify="center"
																css={{
																	height: '$24',
																	width: '$24',
																	borderRadius: '$round',
																	border: '1px solid $colors$primary400',
																	ml: '$12',
																	cursor: switchesState.responsible
																		? 'pointer'
																		: 'default',

																	transition:
																		'all 0.2s ease-in-out',

																	'&:hover':
																		switchesState.responsible
																			? {
																					backgroundColor:
																						'$primary400',
																					color: 'white'
																			  }
																			: 'none'
																}}
																onClick={handleRandomResponsible}
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
																color="primary800"
																css={{ mx: '$8' }}
																size="sm"
															>
																{!responsible
																	? 'Responsible not found!'
																	: `${responsible?.firstName} ${responsible?.lastName}`}
															</Text>

															<Avatar
																css={{ position: 'relative' }}
																size={32}
																colors={{
																	bg: '$highlight2Lighter',
																	fontColor: '$highlight2Dark'
																}}
																fallbackText={getInitials(
																	responsible?.firstName ?? '-',
																	responsible?.lastName ?? '-'
																)}
															/>
														</Flex>
													</ConfigurationSettings>
												</Flex>
											</StyledAccordionContent>
										</StyledAccordionItem>
									)}
							</Accordion>
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
									ref={submitBtnRef}
									type="submit"
									variant="primary"
								>
									Save
								</Button>
							</ButtonsContainer>
						</form>
					</FormProvider>
				</StyledDialogContent>
			</Dialog>
		</StyledDialogContainer>
	);
};

export { BoardSettings };
