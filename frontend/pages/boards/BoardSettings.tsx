import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';

import Icon from '../../components/icons/Icon';
import Button from '../../components/Primitives/Button';
import Flex from '../../components/Primitives/Flex';
import Input from '../../components/Primitives/Input';
import { Switch, SwitchThumb } from '../../components/Primitives/Switch';
import Text from '../../components/Primitives/Text';
import SchemaUpdateBoard from '../../schema/schemaUpdateBoardForm';
import { styled } from '../../stitches.config';
import {
	updateBoardDataState,
	updateBoardError
} from '../../store/updateBoard/atoms/update-board.atom';
import isEmpty from '../../utils/isEmpty';

const Overlay = styled('div', {
	position: 'absolute',
	inset: '0',
	background: 'rgba(80, 80, 89, 0.2) ',
	backdropFilter: 'blur(3px)',
	width: '100%',
	height: '100vh'
});

const Content = styled('div', {
	position: 'absolute',
	backgroundColor: '$white',
	width: '592px',
	height: '100vh',
	right: '0'
});
const DEFAULT_MAX_VOTES = '6';

type BoardSettingsProps = {
	setOpenState: Dispatch<SetStateAction<boolean>>;
	isOpen: boolean;
};

const BoardSettings = ({ setOpenState, isOpen }: BoardSettingsProps) => {
	const [updateBoardData, setUpdateBoardData] = useRecoilState(updateBoardDataState);
	const [isMaxVotesChecked, setIsMaxVotesChecked] = useState(false);

	const haveError = useRecoilValue(updateBoardError);

	const { board } = updateBoardData;
	const methods = useForm<{ text: string; maxVotes: string | undefined }>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		resolver: zodResolver(SchemaUpdateBoard),
		defaultValues: {
			text: board.title,
			maxVotes: undefined
		}
	});

	const handleHideVotesChange = (checked: boolean) => {
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				hideVotes: checked
			}
		}));
	};

	const handlePostAnonymouslyChange = (checked: boolean) => {
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				postAnonymously: checked
			}
		}));
	};

	/**
	 * Handle the max votes switch change
	 */
	useEffect(() => {
		// Destructuring useForm hook
		const { register, unregister, setValue, clearErrors } = methods;

		/**
		 * When not checked reset the
		 * maxVotes value to undefined
		 */
		if (!isMaxVotesChecked) {
			unregister('maxVotes');
			clearErrors('maxVotes');
			setValue('maxVotes', '');
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
		setValue('maxVotes', !isEmpty(board.maxVotes) ? board.maxVotes : DEFAULT_MAX_VOTES);
		register('maxVotes');
		setUpdateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board
				// maxVotes: board.maxVotes != undefined ? board.maxVotes : DEFAULT_MAX_VOTES
			}
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMaxVotesChecked]);

	/**
	 * Use Effect to run once
	 * and validate if the value is not undefined
	 * if yes set the input with this value
	 */
	useEffect(() => {
		if (!isEmpty(board.maxVotes)) {
			methods.setValue('maxVotes', board.maxVotes);
			setIsMaxVotesChecked(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{isOpen && (
				<Overlay>
					<Content>
						<FormProvider {...methods}>
							<Flex direction="column">
								<Flex
									css={{
										borderBottom: '1px solid $colors$primary100'
									}}
								>
									<Text
										heading="4"
										css={{
											padding: '$24 0 $24 $32'
										}}
									>
										Board Settings{' '}
									</Text>

									<Button
										onClick={() => setOpenState(false)}
										isIcon="true"
										css={{
											display: 'flex',
											position: 'absolute',
											right: '$18',
											top: '$10',
											color: '$primary'
										}}
									>
										<Icon
											name="close"
											css={{
												width: '$24',
												height: '$24'
											}}
										/>
									</Button>
								</Flex>
								<Flex direction="column">
									<Text heading="4" css={{ padding: '$24 $32 0' }}>
										{' '}
										Board Name{' '}
									</Text>
									<Input
										css={{ padding: '$16 $40 $56 $32' }}
										disabled={haveError}
										state="default"
										id="text"
										type="text"
										placeholder="Board Name"
										forceState
										maxChars="30"
									/>
								</Flex>

								<Text heading="4" css={{ padding: '0 32px' }}>
									Board Settings{' '}
								</Text>
								<Text heading="5" css={{ padding: '18px 32px' }}>
									Configurations{' '}
									<Icon
										name="arrow-up"
										css={{
											width: '24px',
											height: '24px',
											color: '$primary'
										}}
									/>
								</Text>
								<Flex direction="column" css={{ padding: '25px 32px' }}>
									<Flex gap="20">
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
															width: '10px',
															height: '10px',
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
									<Flex gap="20">
										<Switch
											checked={board.postAnonymously}
											onCheckedChange={handlePostAnonymouslyChange}
											variant="sm"
										>
											<SwitchThumb variant="sm">
												{board.postAnonymously && (
													<Icon
														name="check"
														css={{
															width: '10px',
															height: '10px',
															color: '$successBase'
														}}
													/>
												)}
											</SwitchThumb>
										</Switch>
										<Flex direction="column">
											<Text size="md" weight="medium">
												Option to post cards anonymously
											</Text>
											<Text
												size="sm"
												color="primary500"
												// maxWidth="400px"
											>
												Participants can decide to post cards anonymously or
												publicly (Name on card is disabled/enabled.)
											</Text>
										</Flex>
									</Flex>
									<Flex gap="20">
										<Switch
											checked={isMaxVotesChecked}
											onCheckedChange={() =>
												setIsMaxVotesChecked((prevState) => !prevState)
											}
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
											/>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								justify="end"
								css={{
									borderTop: '1px solid $colors$primary100',
									py: '$24',
									position: 'absolute',
									width: '100%',
									bottom: 0,
									right: 0
								}}
							>
								<Button
									onClick={() => setOpenState(false)}
									variant="primaryOutline"
									css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
								>
									Cancel
								</Button>
								<Button
									onClick={() => setOpenState(false)}
									variant="primary"
									css={{ marginRight: '$32', padding: '$16 $24' }}
								>
									Save
								</Button>
							</Flex>
						</FormProvider>
					</Content>
				</Overlay>
			)}
			;
		</>
	);
};

export default BoardSettings;
