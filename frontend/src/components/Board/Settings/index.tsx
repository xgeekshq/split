import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { Accordion } from '@radix-ui/react-accordion';
import { Dialog, DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

import Icon from 'components/icons/Icon';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import { Switch, SwitchThumb } from 'components/Primitives/Switch';
import Text from 'components/Primitives/Text';
import useBoard from 'hooks/useBoard';
import SchemaUpdateBoard from 'schema/schemaUpdateBoardForm';
import { boardInfoState } from 'store/board/atoms/board.atom';
import { updateBoardDataState, updateBoardError } from 'store/updateBoard/atoms/update-board.atom';
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

type Props = {
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
	socketId: string;
};

const BoardSettings = ({ isOpen, setIsOpen, socketId }: Props) => {
	const submitBtnRef = useRef<HTMLButtonElement | null>(null);

	const [updateBoardData, setUpdateBoardData] = useRecoilState(updateBoardDataState);
	const haveError = useRecoilValue(updateBoardError);

	const [isMaxVotesChecked, setIsMaxVotesChecked] = useState(false);

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
		mutate(
			{
				board: {
					...updateBoardData.board,
					title,
					maxVotes,
					socketId
				}
			},
			{
				onSuccess: () => {
					setIsOpen(false);
				}
			}
		);
	};

	/**
	 * Use Effect to submit the board settings form when press enter key
	 * (Note: Radix Dialog close when pressing enter)
	 */
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

	const configurationSettings = (
		title: string,
		text: string,
		isChecked: boolean,
		handleCheckedChange: (checked: boolean) => void,
		child?: ReactNode
	) => (
		<Flex gap={20}>
			<Switch checked={isChecked} variant="sm" onCheckedChange={handleCheckedChange}>
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
				<Text color="primary500" size="sm">
					{text}
				</Text>
				{child}
			</Flex>
		</Flex>
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="primaryOutline"
					css={{
						ml: 'auto'
					}}
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
						<Flex css={{ marginBottom: '$32' }} direction="column" gap={16}>
							<Text heading="4">Board Name</Text>
							<Input
								forceState
								disabled={haveError}
								id="title"
								maxChars="30"
								placeholder="Board Name"
								state="default"
								type="text"
							/>
						</Flex>

						<Text css={{ display: 'block', mb: '$16' }} heading="4">
							Board Settings
						</Text>

						<Accordion collapsible defaultValue="configurations" type="single">
							<StyledAccordionItem value="configurations">
								<StyledAccordionHeader>
									<StyledAccordionTrigger>
										<Text heading="5">Configurations</Text>
										<StyledAccordionIcon name="arrow-down" />
									</StyledAccordionTrigger>
								</StyledAccordionHeader>
								<StyledAccordionContent>
									<Flex direction="column" gap={16}>
										{configurationSettings(
											'Hide cards from others',
											'Participants can not see the cards from other participants of this retrospective.',
											board.hideCards,
											handleHideCardsChange
										)}
										{!isSubBoard && (
											<>
												{configurationSettings(
													'Hide votes from others',
													'Participants can not see the votes from other participants of this retrospective.',
													board.hideVotes,
													handleHideVotesChange
												)}
												{configurationSettings(
													'Limit votes',
													'Make votes more significant by limiting them.',
													isMaxVotesChecked,
													handleMaxVotes,
													<Input
														css={{ mt: '$8' }}
														disabled={!isMaxVotesChecked}
														id="maxVotes"
														name="maxVotes"
														placeholder="Max votes"
														type="number"
														min={
															boardData!.board.totalUsedVotes === 0
																? 0
																: board.maxVotes
														}
													/>
												)}
											</>
										)}
									</Flex>
								</StyledAccordionContent>
							</StyledAccordionItem>
						</Accordion>

						<ButtonsContainer gap={24} justify="end">
							<Button
								css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
								variant="primaryOutline"
								onClick={() => setIsOpen(false)}
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
	);
};

export { BoardSettings };
