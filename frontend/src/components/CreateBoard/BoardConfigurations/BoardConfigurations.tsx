import { useFormContext } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import Input from '@/components/Primitives/Inputs/Input/Input';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { createBoardDataState } from '@/store/createBoard/atoms/create-board.atom';

const DEFAULT_MAX_VOTES = 6;

type BoardConfigurationOptions = 'hideCards' | 'hideVotes' | 'postAnonymously' | 'isPublic';

type BoardConfigurationsProps = {
  isRegularBoard?: Boolean;
};

const BoardConfigurations = ({ isRegularBoard }: BoardConfigurationsProps) => {
  const [createBoardData, setCreateBoardData] = useRecoilState(createBoardDataState);
  const { board } = createBoardData;
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
        title="Hide cards from others"
        text="Participants can not see the cards from other participants of this retrospective."
        isChecked={board.hideCards}
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'hideCards')}
      />
      <ConfigurationSwitch
        title="Hide votes from others"
        text="Participants can not see the votes from other participants of this retrospective."
        isChecked={board.hideVotes}
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'hideVotes')}
      />
      <ConfigurationSwitch
        title="Post anonymously"
        text="The option to post anonymously is checked by default."
        isChecked={board.postAnonymously}
        handleCheckedChange={(checked) => handleCheckedChange(checked, 'postAnonymously')}
      />
      <ConfigurationSwitch
        title="Limit votes"
        text=" Make votes more significant by limiting them."
        isChecked={!!board.maxVotes}
        handleCheckedChange={handleLimitVotesChange}
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
          title="Make board public"
          text=" If you make this board public anyone with the link to the board can access it. Where
          to find the link? Just copy the URL of the board itself and share it."
          isChecked={board.isPublic}
          handleCheckedChange={(checked) => handleCheckedChange(checked, 'isPublic')}
        />
      )}
    </Flex>
  );
};

export default BoardConfigurations;
