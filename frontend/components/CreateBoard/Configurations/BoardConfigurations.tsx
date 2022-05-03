import { useFormContext } from "react-hook-form";
import { useRecoilState } from "recoil";
import { createBoardDataState } from "../../../store/createBoard/atoms/create-board.atom";
import CheckIcon from "../../icons/Check";
import Flex from "../../Primitives/Flex";
import Input from "../../Primitives/Input";
import { Switch, SwitchThumb } from "../../Primitives/Switch";
import Text from "../../Primitives/Text";

const BoardConfigurations = () => {
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

  const handlePostAnonymouslyChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        postAnonymously: checked,
      },
    }));
  };

  const handleLimitVotesChange = (checked: boolean) => {
    setCreateBoardData((prev) => ({
      ...prev,
      board: {
        ...prev.board,
        maxVotes: checked ? "6" : undefined,
      },
    }));
    setValue("maxVotes", checked ? "6" : "");
    if (checked) register("maxVotes");
    if (!checked) {
      unregister("maxVotes");
      clearErrors("maxVotes");
    }
  };

  return (
    <Flex direction="column">
      <Text color="primary500" css={{ py: "$32" }}>
        You can change the board configurations still later inside your retro board.
      </Text>
      <Flex direction="column" gap="24">
        <Flex gap="16">
          <Switch checked={board.hideCards} onCheckedChange={handleHideCardsChange}>
            <SwitchThumb>
              {board.hideCards && (
                <CheckIcon css={{ size: "$10", color: "$successBase !important" }} />
              )}
            </SwitchThumb>
          </Switch>
          <Flex direction="column">
            <Text size="md" weight="medium">
              Hide cards from others
            </Text>
            <Text size="sm" color="primary500">
              Participants can not see the cards from other participants of this retrospective.
            </Text>
          </Flex>
        </Flex>
        <Flex gap="16">
          <Switch checked={board.hideVotes} onCheckedChange={handleHideVotesChange}>
            <SwitchThumb>
              {board.hideVotes && (
                <CheckIcon css={{ size: "$10", color: "$successBase !important" }} />
              )}
            </SwitchThumb>
          </Switch>
          <Flex direction="column">
            <Text size="md" weight="medium">
              Hide votes from others
            </Text>
            <Text size="sm" color="primary500">
              Participants can not see the votes from other participants of this retrospective.
            </Text>
          </Flex>
        </Flex>
        <Flex gap="16">
          <Switch checked={board.postAnonymously} onCheckedChange={handlePostAnonymouslyChange}>
            <SwitchThumb>
              {board.postAnonymously && (
                <CheckIcon css={{ size: "$10", color: "$successBase !important" }} />
              )}
            </SwitchThumb>
          </Switch>
          <Flex direction="column">
            <Text size="md" weight="medium">
              Option to post cards anonymously
            </Text>
            <Text size="sm" color="primary500">
              Participants can decide to post cards anonymously or publicly (Name on card is
              disabled/enabled.)
            </Text>
          </Flex>
        </Flex>
        <Flex gap="16">
          <Switch checked={!!board.maxVotes} onCheckedChange={handleLimitVotesChange}>
            <SwitchThumb>
              {!!board.maxVotes && (
                <CheckIcon css={{ size: "$10", color: "$successBase !important" }} />
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
              css={{ mt: "$8" }}
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
