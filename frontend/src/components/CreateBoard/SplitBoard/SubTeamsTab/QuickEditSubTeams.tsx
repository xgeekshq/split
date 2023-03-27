import { ChangeEvent, useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import useCreateBoard from '@/hooks/useCreateBoard';
import { Team } from '@/types/team/team';
import Input from '@/components/Primitives/Inputs/Input/Input';
import { useFormContext } from 'react-hook-form';

type QuickEditSubTeamsProps = {
  team: Team;
};

const QuickEditSubTeams = ({ team }: QuickEditSubTeamsProps) => {
  const { register, getValues, setValue } = useFormContext();
  const { setCreateBoardData, handleSplitBoards, teamMembers } = useCreateBoard(team);
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

    if (!error) setValue('maxUsers', Math.ceil(teamLength / +value));

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
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(Math.floor(getValues('maxTeams'))),
      },
    }));
  };

  useEffect(() => {
    setValue('maxTeams', minTeams);
    setValue('maxUsers', maxUsers);
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" size="sm" css={{ py: '$24' }}>
          <Icon name="edit" />
          Quick edit sub-teams configurations
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        css={{ top: '200px', flexDirection: 'column' }}
        title="Quick edit sub-teams configurations"
      >
        <Flex>
          <Flex css={{ position: 'relative', top: '3px' }}>
            <Icon css={{ width: '$16', height: '$16', color: '$primary500' }} name="info" />
          </Flex>
          <Text color="primary500" css={{ pl: '$8' }} size="md">
            Note, if you change any of the two values below, the other value will adjust
            accordingly.
          </Text>
        </Flex>
        <Flex css={{ mt: '$24', width: '100%' }} gap="24">
          <Flex css={{ width: '100%' }} direction="column" gap="8">
            <Text label>Sub-teams count</Text>
            <Input
              css={{ mb: 0 }}
              id="maxTeams"
              max={maxTeams}
              min={minTeams}
              type="number"
              {...register('maxTeams', { onChange: handleChangeCountTeams })}
            />
            <Flex>
              <Text hint color={errors.teamError ? 'dangerBase' : 'primary800'}>
                Min {minTeams}, Max {maxTeams}{' '}
                <Text hint color="primary300">
                  sub-teams
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ width: '100%' }} direction="column" gap="8">
            <Text label>Max sub-team members count</Text>
            <Input
              css={{ mb: 0 }}
              id="maxUsers"
              max={maxUsers}
              min={minUsers}
              type="number"
              {...register('maxUsers', { onChange: handleMaxMembers })}
            />
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
        <Flex css={{ mt: '$32' }} gap="24" justify="end">
          <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveConfigs} disabled={isSubmitDisabled}>
            Save configurations
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuickEditSubTeams;
