import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { zodResolver } from '@hookform/resolvers/zod';
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
};

const BoardSettings = ({ isOpen, setIsOpen }: Props) => {
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
		resolver: zodResolver(SchemaUpdateBoard),
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
					maxVotes
				}
			},
			{
				onSuccess: () => {
					setIsOpen(false);
				}
			}
		);
	};

	const configurationSettings = (
		title: string,
		text: string,
		isChecked: boolean,
		handleCheckedChange: (checked: boolean) => void,
		child?: ReactNode
	) => (
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
				{child}
			</Flex>
		</Flex>
	);

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
						<Flex direction="column" gap={16} css={{ marginBottom: '$32' }}>
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

						<Text heading="4" css={{ display: 'block', mb: '$16' }}>
							Board Settings
						</Text>

						<Accordion type="single" defaultValue="configurations" collapsible>
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
													'Hide cards from others',
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
														id="maxVotes"
														name="maxVotes"
														type="number"
														css={{ mt: '$8' }}
														disabled={!isMaxVotesChecked}
														placeholder="Max votes"
														min={board.maxVotes}
													/>
												)}
											</>
										)}
									</Flex>
								</StyledAccordionContent>
							</StyledAccordionItem>
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

export { BoardSettings };
