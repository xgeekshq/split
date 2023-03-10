import { ChangeEvent, useEffect, useState } from 'react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import useCreateBoard from '@/hooks/useCreateBoard';
import { Team } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';
import Button from '@/components/Primitives/Inputs/Button/Button';

interface QuickEditSubTeamsProps {
  team: Team;
}

const StyledInput = styled('input', {
  display: 'flex',
  fontSize: '$16',
  px: '$16',
  boxShadow: '0',
  border: '1px solid $primary200',
  outline: 'none',
  width: '100%',
  borderRadius: '$4',
  lineHeight: '$20',
  height: '$56',
  'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  'input[type=number]': {
    '-moz-appearance': 'textfield',
  },
  '&:focus': {
    borderColor: '$primary400',
    boxShadow: '0px 0px 0px 2px $colors$primaryLightest',
  },
  '&:-webkit-autofill': {
    '-webkit-box-shadow': '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest',
  },
  variants: {
    variant: {
      default: {
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0px 0px 0px 2px $colors$primaryLightest',
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest',
        },
      },
      error: {
        '&:focus': {
          borderColor: '$danger700',
          boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
        },
        borderColor: '$danger700',
        boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$dangerLightest',
        },
      },
    },
  },
});

const QuickEditSubTeams = ({ team }: QuickEditSubTeamsProps) => {
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

  const [values, setValues] = useState<{
    teamsCount: number | string;
    teamError: boolean;
    maxUsersCount: number | string;
    maxUserError: boolean;
  }>({
    teamsCount,
    teamError: false,
    maxUsersCount,
    maxUserError: false,
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    setValues({
      teamsCount,
      teamError: false,
      maxUsersCount,
      maxUserError: false,
    });
  }, [maxUsersCount, teamsCount]);

  const hasError = (value: number | string, min: number, max: number) =>
    +value < min || +value > max;

  const handleChangeCountTeams = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const error = hasError(value, minTeams, maxTeams);
    setIsSubmitDisabled(error);

    setValues((prev) => ({
      ...prev,
      teamsCount: value,
      teamError: error,
      maxUsersCount: !error ? Math.ceil(teamLength / +value) : prev.maxUsersCount,
      maxUserError: !error
        ? hasError(Math.ceil(teamLength / +value), minUsers, maxUsers)
        : prev.maxUserError,
    }));
  };

  const handleMaxMembers = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const error = hasError(value, minUsers, maxUsers);
    setIsSubmitDisabled(error);

    setValues((prev) => ({
      ...prev,
      maxUsersCount: value,
      teamError: !error
        ? hasError(Math.ceil(teamLength / +value), minTeams, maxTeams)
        : prev.teamError,
      teamsCount: !error ? Math.ceil(teamLength / +value) : prev.teamsCount,
      maxUserError: error,
    }));
  };

  const handleSaveConfigs = () => {
    if (isEmpty(values.teamsCount) || isEmpty(values.maxUsersCount)) return;
    setCreateBoardData((prev) => ({
      ...prev,
      count: {
        ...prev.count,
        teamsCount: Math.floor(+values.teamsCount),
        maxUsersCount: Math.floor(+values.maxUsersCount),
      },
      board: {
        ...prev.board,
        dividedBoards: handleSplitBoards(Math.floor(+values.teamsCount)),
      },
    }));
  };

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
            <StyledInput
              css={{ mb: 0 }}
              id="teamsCount"
              variant={values.teamError ? 'error' : 'default'}
              max={maxTeams}
              min={minTeams}
              placeholder=" "
              type="number"
              value={values.teamsCount}
              onChange={handleChangeCountTeams}
            />
            <Flex>
              <Text hint color={values.teamError ? 'dangerBase' : 'primary800'}>
                Min {minTeams}, Max {maxTeams}{' '}
                <Text hint color="primary300">
                  sub-teams
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ width: '100%' }} direction="column" gap="8">
            <Text label>Max sub-team members count</Text>
            <StyledInput
              css={{ mb: 0 }}
              id="maxUsers"
              variant={values.maxUserError ? 'error' : 'default'}
              max={maxUsers}
              min={minUsers}
              placeholder=" "
              type="number"
              value={values.maxUsersCount}
              onChange={handleMaxMembers}
            />
            <Flex>
              <Text hint color={values.maxUserError ? 'dangerBase' : 'primary800'}>
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
