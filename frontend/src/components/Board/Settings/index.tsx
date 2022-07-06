import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
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

		if (!isEmpty(board.maxVotes)) {
			methods.setValue('maxVotes', board.maxVotes);
			setIsMaxVotesChecked(true);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [board]);

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
			setValue('maxVotes', undefined);

			setUpdateBoardData((prev) => ({
				...prev,
				board: {
					...prev.board,
					maxVotes: undefined
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
										<Flex gap={20}>
											<Switch
												checked={board.hideVotes}
												onCheckedChange={handleHideVotesChange}
												variant="sm"
											>
												<SwitchThumb variant="sm">
													{board.hideVotes && (
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
													Hide votes from others
												</Text>
												<Text size="sm" color="primary500">
													Participants can not see the votes from other
													participants of this retrospective.
												</Text>
											</Flex>
										</Flex>
										<Flex gap={20}>
											<Switch
												checked={isMaxVotesChecked}
												onCheckedChange={handleMaxVotes}
												variant="sm"
											>
												<SwitchThumb variant="sm">
													{isMaxVotesChecked && (
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
													Limit votes
												</Text>
												<Text size="sm" color="primary500">
													Make votes more significant by limiting them.
												</Text>
												<Input
													id="maxVotes"
													name="maxVotes"
													type="number"
													css={{ mt: '$8' }}
													disabled={!isMaxVotesChecked}
													placeholder="Max votes"
													min={board.maxVotes}
												/>
											</Flex>
										</Flex>
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
