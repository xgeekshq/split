import { useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Input from 'components/Primitives/Input';
import { Switch, SwitchThumb } from 'components/Primitives/Switch';
import Text from 'components/Primitives/Text';
import { createBoardDataState } from 'store/createBoard/atoms/create-board.atom';

const DEFAULT_MAX_VOTES = 6;

const BoardConfigurations = () => {
	const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);

	const { board } = createBoardData;

	const { register, unregister, clearErrors, setValue } = useFormContext();

	const handleHideCardsChange = (checked: boolean) => {
		setCreateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				hideCards: checked
			}
		}));
	};

	const handleHideVotesChange = (checked: boolean) => {
		setCreateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				hideVotes: checked
			}
		}));
	};

	const handleLimitVotesChange = (checked: boolean) => {
		setCreateBoardData((prev) => ({
			...prev,
			board: {
				...prev.board,
				maxVotes: checked ? DEFAULT_MAX_VOTES : undefined
			}
		}));

		if (!checked) {
			unregister('maxVotes');
			clearErrors('maxVotes');
			return;
		}

		setValue('maxVotes', DEFAULT_MAX_VOTES);
		register('maxVotes');
	};

	return (
		<Flex direction="column">
			<Text color="primary500" css={{ py: '$32' }}>
				You can change the board configurations still later inside your retro board.
			</Text>
			<Flex direction="column" gap="24">
				<Flex gap="16">
					<Switch checked={board.hideCards} onCheckedChange={handleHideCardsChange}>
						<SwitchThumb>
							{board.hideCards && (
								<Icon
									name="check"
									css={{
										width: '$14',
										height: '$14',
										color: '$successBase'
									}}
								/>
							)}
						</SwitchThumb>
					</Switch>
					<Flex direction="column">
						<Text size="md" weight="medium">
							Hide cards from others
						</Text>
						<Text size="sm" color="primary500">
							Participants can not see the cards from other participants of this
							retrospective.
						</Text>
					</Flex>
				</Flex>
				<Flex gap="16">
					<Switch checked={board.hideVotes} onCheckedChange={handleHideVotesChange}>
						<SwitchThumb>
							{board.hideVotes && (
								<Icon
									name="check"
									css={{
										width: '$14',
										height: '$14',
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
							Participants can not see the votes from other participants of this
							retrospective.
						</Text>
					</Flex>
				</Flex>
				<Flex gap="16">
					<Switch checked={!!board.maxVotes} onCheckedChange={handleLimitVotesChange}>
						<SwitchThumb>
							{!!board.maxVotes && (
								<Icon
									name="check"
									css={{
										width: '$14',
										height: '$14',
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
							css={{ mt: '$8' }}
							id="maxVotes"
							disabled={!board.maxVotes}
							type="number"
							placeholder="Max votes"
						/>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default BoardConfigurations;
