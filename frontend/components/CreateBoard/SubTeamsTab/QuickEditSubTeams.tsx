import { ChangeEvent, useState, useEffect } from "react";
import { styled } from "../../../stitches.config";
import { Team } from "../../../types/team/team";
import CrossIcon from "../../icons/CrossIcon";
import EditIcon from "../../icons/Edit";
import InfoIcon from "../../icons/Info";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../Primitives/AlertDialog";
import Flex from "../../Primitives/Flex";
import Separator from "../../Primitives/Separator";
import Text from "../../Primitives/Text";
import useCreateBoard from "../../../hooks/useCreateBoard";
import isEmpty from "../../../utils/isEmpty";

interface QuickEditSubTeamsProps {
  team: Team;
}

const StyledInput = styled("input", {
  display: "flex",
  fontSize: "$16",
  px: "$16",
  boxShadow: "0",
  border: "1px solid $primary200",
  outline: "none",
  width: "100%",
  borderRadius: "$4",
  lineHeight: "$20",
  height: "$56",
  "input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "&:focus": {
    borderColor: "$primary400",
    boxShadow: "0px 0px 0px 2px $colors$primaryLightest",
  },
  "&:-webkit-autofill": {
    "-webkit-box-shadow": "0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest",
  },
});

const QuickEditSubTeams = ({ team }: QuickEditSubTeamsProps) => {
  const { createBoardData, setCreateBoardData, handleSplitBoards, teamMembers } =
    useCreateBoard(team);

  const {
    count: { teamsCount, maxUsersCount },
  } = createBoardData;
  const teamLength = teamMembers.length ?? 0;
  const minUsers = teamLength % 2 === 0 ? 2 : 3;
  const maxTeams = Math.floor(teamLength / 2);
  const minTeams = 2;
  const maxUsers = Math.ceil(teamLength / 2);

  const [values, setValues] = useState<{
    teamsCount: number | string;
    maxUsersCount: number | string;
  }>({
    teamsCount,
    maxUsersCount,
  });

  useEffect(() => {
    setValues({
      teamsCount,
      maxUsersCount,
    });
  }, [maxUsersCount, teamsCount]);

  const handleMaxUsersValue = (value: number | string) => {
    if (Number(value) < minUsers) return minUsers;
    if (Number(value) > maxUsers) return maxUsers;
    return value;
  };

  const handleTeamsValue = (value: number | string) => {
    if (Number(value) < minTeams) return minTeams;
    if (Number(value) > maxTeams) return maxTeams;
    return value;
  };

  const handleChangeCountTeams = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const currentValue = handleTeamsValue(value);
    setValues((prev) => ({
      ...prev,
      teamsCount: currentValue,
      maxUsersCount: !isEmpty(value)
        ? Math.ceil(teamMembers.length / Number(currentValue))
        : prev.maxUsersCount,
    }));
  };

  const handleMaxMembers = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const currentValue = handleMaxUsersValue(value);
    setValues((prev) => ({
      ...prev,
      maxUsersCount: currentValue,
      teamsCount: !isEmpty(value)
        ? Math.ceil(teamMembers.length / Number(currentValue))
        : prev.teamsCount,
    }));
  };

  const handleSaveConfigs = () => {
    if (isEmpty(values.teamsCount) || isEmpty(values.maxUsersCount)) return;
    setCreateBoardData((prev) => ({
      ...prev,
      count: {
        ...prev.count,
        teamsCount: Number(values.teamsCount),
        maxUsersCount: Number(values.maxUsersCount),
      },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(Number(values.teamsCount)),
      },
    }));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Flex align="center" justify="end" css={{ py: "$14" }} gap="8">
          <EditIcon dropdown={false} />
          <Text size="sm" weight="medium">
            Quick edit sub-teams configurations
          </Text>
        </Flex>
      </AlertDialogTrigger>
      <AlertDialogContent css={{ left: "35% !important", top: "200px", flexDirection: "column" }}>
        <Flex justify="between" align="center" css={{ px: "$32", py: "$24" }}>
          <Text heading="4">Quick edit sub-teams configurations</Text>
          <AlertDialogCancel isIcon asChild css={{ p: 0, height: "$24" }}>
            <Flex css={{ "& svg": { color: "$primary400" } }}>
              <CrossIcon size="24" />
            </Flex>
          </AlertDialogCancel>
        </Flex>
        <Separator css={{ backgroundColor: "$primary100" }} />
        <Flex direction="column" css={{ pt: "$29", px: "$32", pb: "$32" }}>
          <Flex>
            <Flex css={{ position: "relative", top: "3px" }}>
              <InfoIcon size="16" />
            </Flex>
            <Text css={{ pl: "$8" }} size="md" color="primary500">
              Note, if you change any of the two values below, the other value will adjust
              accordingly.
            </Text>
          </Flex>
          <Flex css={{ mt: "$24", width: "100%" }} gap="24">
            <Flex gap="8" direction="column" css={{ width: "100%" }}>
              <Text label>Sub-teams count</Text>
              <StyledInput
                type="number"
                min={minTeams}
                max={maxTeams}
                value={values.teamsCount}
                onChange={handleChangeCountTeams}
                id="teamsCount"
                placeholder=" "
                css={{ mb: 0 }}
              />
              <Flex>
                <Text hint css={{ color: "$primary800" }}>
                  Min {minTeams}, Max {maxTeams}{" "}
                  <Text hint color="primary300">
                    sub-teams
                  </Text>
                </Text>
              </Flex>
            </Flex>
            <Flex gap="8" direction="column" css={{ width: "100%" }}>
              <Text label>Max sub-team members count</Text>
              <StyledInput
                type="number"
                value={values.maxUsersCount}
                min={minUsers}
                max={maxUsers}
                onChange={handleMaxMembers}
                id="maxUsers"
                placeholder=" "
                css={{ mb: 0 }}
              />
              <Flex>
                <Text hint css={{ color: "$primary800" }}>
                  Min {minUsers}, Max {maxUsers}{" "}
                  <Text hint color="primary300">
                    members per team
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex css={{ mt: "$32" }} justify="end" gap="24">
            <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveConfigs}>Save configurations</AlertDialogAction>
          </Flex>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuickEditSubTeams;
