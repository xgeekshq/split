import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useCreateBoard from '@/hooks/useCreateBoard';
import { Team } from '@/types/team/team';

type QuickEditSubTeamsProps = {
  team: Team;
};

const QuickEditSubTeams = ({ team }: QuickEditSubTeamsProps) => {
  const { register, getValues, setValue } = useFormContext();
  const { createBoardData, setCreateBoardData, handleSplitBoards, teamMembers } =
    useCreateBoard(team);
  const {
    count: { teamsCount, maxUsersCount },
  } = createBoardData;

  const teamLength = teamMembers?.length ?? 0;
  const minUsers = teamLength % 2 === 0 ? 2 : 3;
  const maxTeams = Math.floor(teamLength / 2);
  const minTeams = 2;
  const maxUsers = Math.ceil(teamLength / 2);

  const [errors, setErrors] = useState<{
    teamError: boolean;
    maxUserError: boolean;
  }>({
    teamError: false,
    maxUserError: false,
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const hasError = (value: number | string, min: number, max: number) =>
    +value < min || +value > max;

  const handleChangeCountTeams = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const error = hasError(value, minTeams, maxTeams);
    setIsSubmitDisabled(error);

    if (!error) setValue('maxUsers', Math.round(teamLength / +value));

    setErrors((prev) => ({
      ...prev,
      teamError: error,
      maxUserError: !error
        ? hasError(Math.ceil(teamLength / +value), minUsers, maxUsers)
        : prev.maxUserError,
    }));
  };

  const handleMaxMembers = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const error = hasError(value, minUsers, maxUsers);
    setIsSubmitDisabled(error);

    if (!error) setValue('maxTeams', Math.ceil(teamLength / +value));

    setErrors((prev) => ({
      ...prev,
      teamError: !error
        ? hasError(Math.ceil(teamLength / +value), minTeams, maxTeams)
        : prev.teamError,
      maxUserError: error,
    }));
  };

  const handleSaveConfigs = () => {
    setCreateBoardData((prev) => ({
      ...prev,
      count: {
        ...prev.count,
        teamsCount: Math.floor(getValues('maxTeams')),
        maxUsersCount: Number((teamLength / Math.floor(getValues('maxTeams'))).toFixed(2)),
      },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(Math.floor(getValues('maxTeams'))),
      },
    }));
  };

  useEffect(() => {
    setValue('maxTeams', teamsCount);
    setValue('maxUsers', Math.round(maxUsersCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamsCount, maxUsersCount]);

  useEffect(() => {
    register('maxTeams', { onChange: handleChangeCountTeams });
    register('maxUsers', { onChange: handleMaxMembers });
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button css={{ py: '$24' }} size="sm" variant="link">
          <Icon name="edit" />
          Quick edit sub-teams configurations
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent css={{ gap: 24 }} title="Quick edit sub-teams configurations">
        <Flex gap={8}>
          <Icon css={{ color: '$primary500' }} name="info" size={24} />
          <Text color="primary500" size="md">
            Note, if you change any of the two values below, the other value will adjust
            accordingly.
          </Text>
        </Flex>
        <Flex gap="24">
          <Flex direction="column" gap={8}>
            <Text label>Sub-teams count</Text>
            <Input css={{ mb: 0 }} id="maxTeams" max={maxTeams} min={minTeams} type="number" />
            <Flex>
              <Text hint color={errors.teamError ? 'dangerBase' : 'primary800'}>
                Min {minTeams}, Max {maxTeams}{' '}
                <Text hint color="primary300">
                  sub-teams
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" gap={8}>
            <Text label>Max sub-team members count</Text>
            <Input css={{ mb: 0 }} id="maxUsers" max={maxUsers} min={minUsers} type="number" />
            <Flex>
              <Text hint color={errors.maxUserError ? 'dangerBase' : 'primary800'}>
                Min {minUsers}, Max {maxUsers}{' '}
                <Text hint color="primary300">
                  members per team
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={24} justify="end">
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isSubmitDisabled} onClick={handleSaveConfigs}>
            Save configurations
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuickEditSubTeams;
