import { useFormContext } from 'react-hook-form';

import Input from '@/components/Primitives/Inputs/Input/Input';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useCreateBoard from '@hooks/useCreateBoard';

const DEFAULT_MAX_VOTES = 6;

type BoardConfigurationOptions = 'hideCards' | 'hideVotes' | 'postAnonymously' | 'isPublic';

type BoardConfigurationsProps = {
  isRegularBoard?: boolean;
};

const BoardConfigurations = ({ isRegularBoard }: BoardConfigurationsProps) => {
  const {
    createBoardData: { board },
    setCreateBoardData,
  } = useCreateBoard();
  const { register, unregister, clearErrors, setValue } = useFormContext();

  const handleCheckedChange = (checked: boolean, key: BoardConfigurationOptions) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        [key]: checked,
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

  return (
    <Flex direction="column" gap={24}>
      <Text color="primary500">
        You can change the board configurations still later inside your retro board.
      </Text>
      <ConfigurationSwitch
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'hideCards')}
        isChecked={board.hideCards}
        text="Participants can not see the cards from other participants of this retrospective."
        title="Hide cards from others"
      />
      <ConfigurationSwitch
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'hideVotes')}
        isChecked={board.hideVotes}
        text="Participants can not see the votes from other participants of this retrospective."
        title="Hide votes from others"
      />
      <ConfigurationSwitch
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'postAnonymously')}
        isChecked={board.postAnonymously}
        text="The option to post anonymously is checked by default."
        title="Post anonymously"
      />
      <ConfigurationSwitch
        handleCheckedChange={handleLimitVotesChange}
        isChecked={!!board.maxVotes}
        text=" Make votes more significant by limiting them."
        title="Limit votes"
      >
        <Input
          css={{ mt: '$8', mb: 0 }}
          disabled={!board.maxVotes}
          id="maxVotes"
          placeholder="Max votes"
          type="number"
        />
      </ConfigurationSwitch>
      {isRegularBoard && (
        <ConfigurationSwitch
          handleCheckedChange={(checked) => handleCheckedChange(checked, 'isPublic')}
          isChecked={board.isPublic}
          title="Make board public"
          text=" If you make this board public anyone with the link to the board can access it. Where
          to find the link? Just copy the URL of the board itself and share it."
        />
      )}
    </Flex>
  );
};

export default BoardConfigurations;
