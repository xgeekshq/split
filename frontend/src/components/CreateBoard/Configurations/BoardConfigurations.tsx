import { useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import Switch from '@/components/Primitives/Switch';
import Text from '@/components/Primitives/Text';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';

const DEFAULT_MAX_VOTES = 6;

type BoardConfigurationsProps = {
  isRegularBoard?: Boolean;
};

const BoardConfigurations = ({ isRegularBoard }: BoardConfigurationsProps) => {
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);

  const { board } = createBoardData;

  const { register, unregister, clearErrors, setValue } = useFormContext();

  const handleHideCardsChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        hideCards: checked,
      },
    }));
  };

  const handleHideVotesChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        hideVotes: checked,
      },
    }));
  };

  const handleLimitVotesChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        maxVotes: checked ? DEFAULT_MAX_VOTES : undefined,
      },
    }));

    if (!checked) {
      unregister('maxVotes');
      clearErrors('maxVotes');
      return;
    }

    setValue('maxVotes', DEFAULT_MAX_VOTES);
    register('maxVotes');
  };

  const handleMakeBoardPublicChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        isPublic: checked,
      },
    }));
  };

  return (
    <Flex direction="column">
      <Text color="primary500" css={{ py: '$32' }}>
        You can change the board configurations still later inside your retro board.
      </Text>
      <Flex direction="column" gap="24">
        <Flex gap="16">
          <Switch checked={board.hideCards} onCheckedChange={handleHideCardsChange} />
          <Flex direction="column">
            <Text size="md" fontWeight="medium">
              Hide cards from others
            </Text>
            <Text color="primary500" size="sm">
              Participants can not see the cards from other participants of this retrospective.
            </Text>
          </Flex>
        </Flex>
        <Flex gap="16">
          <Switch checked={board.hideVotes} onCheckedChange={handleHideVotesChange} />
          <Flex direction="column">
            <Text size="md" fontWeight="medium">
              Hide votes from others
            </Text>
            <Text color="primary500" size="sm">
              Participants can not see the votes from other participants of this retrospective.
            </Text>
          </Flex>
        </Flex>
        <Flex gap="16">
          <Switch checked={!!board.maxVotes} onCheckedChange={handleLimitVotesChange} />
          <Flex direction="column">
            <Text size="md" fontWeight="medium">
              Limit votes
            </Text>
            <Text color="primary500" size="sm">
              Make votes more significant by limiting them.
            </Text>
            <Input
              css={{ mt: '$8', mb: 0 }}
              disabled={!board.maxVotes}
              id="maxVotes"
              placeholder="Max votes"
              type="number"
            />
          </Flex>
        </Flex>
        {isRegularBoard && (
          <Flex gap="16">
            <Switch checked={board.isPublic} onCheckedChange={handleMakeBoardPublicChange} />
            <Flex direction="column">
              <Text size="md" fontWeight="medium">
                Make board public
              </Text>
              <Text color="primary500" size="sm">
                If you make this board public anyone with the link to the board can access it. Where
                to find the link? Just copy the URL of the board itself and share it.
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default BoardConfigurations;
