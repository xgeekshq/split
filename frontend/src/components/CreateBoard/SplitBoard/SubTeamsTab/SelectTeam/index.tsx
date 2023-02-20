import React, { useCallback, useEffect, useMemo } from 'react';
import Icon from '@/components/Primitives/Icon';
import Text from '@/components/Primitives/Text';
import { teamsOfUser } from '@/store/team/atom/team.atom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { MIN_MEMBERS } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import isEmpty from '@/utils/isEmpty';
import Flex from '@/components/Primitives/Flex';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import useCreateBoard from '@/hooks/useCreateBoard';
import { useRouter } from 'next/router';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
} from '@/components/Primitives/Select';
import { Team } from '@/types/team/team';
import { HelperTextWrapper } from './styles';

type SelectTeamProps = {
  previousTeam?: string;
};

const SelectTeam = ({ previousTeam }: SelectTeamProps) => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();
  const routerTeam = router.query.team as string;

  /**
   * Recoil Atoms and Hooks
   */
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const setHaveError = useSetRecoilState(createBoardError);
  const teams = useRecoilValue(teamsOfUser);
  const { handleSplitBoards, setCreateBoardData, teamMembers } = useCreateBoard(selectedTeam);

  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const message = errors.team?.message;
  const teamValueOnForm = getValues().team;
  const isValueEmpty = isEmpty(teamValueOnForm);

  const isAdminOrStakeholder = (team: Team) =>
    !!team.users?.find(
      (teamUser) =>
        teamUser.user._id === session?.user.id &&
        [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
    ) || session?.user.isSAdmin;

  const teamMembersCount = teamMembers?.length ?? 0;
  const numberOfTeams = teams?.filter((team) => isAdminOrStakeholder(team)).length ?? 0;

  const currentSelectTeamState = useMemo(() => {
    if (message) return 'error';
    if (isValueEmpty) return 'default';
    if (!message && !isValueEmpty) return 'valid';
    return undefined;
  }, [message, isValueEmpty]);

  const isHelperEmpty = isEmpty(message);

  const handleTeamChange = (value: string) => {
    clearErrors();
    const foundTeam = teams.find((team) => team.id === value);

    setValue('team', foundTeam?.id);

    setSelectedTeam(foundTeam);
  };

  const teamsNames = useMemo(
    () =>
      teams
        .filter((team) => isAdminOrStakeholder(team))
        .map((team) => ({
          label: `${team.name} (${team.users.length} members)`,
          value: team.id,
        })),
    [teams],
  );

  const verifyIfCanCreateBoard = useCallback(() => {
    if (!selectedTeam) {
      return true;
    }

    const haveMinMembers = !!(
      selectedTeam.users?.filter((user) => user.role !== TeamUserRoles.STAKEHOLDER).length >=
      MIN_MEMBERS
    );

    return !haveMinMembers || !isAdminOrStakeholder(selectedTeam);
  }, [selectedTeam, session?.user.id, session?.user.isSAdmin]);

  const createBoard = useCallback(() => {
    if (!selectedTeam) {
      return;
    }
    const maxUsersCount = Math.ceil(teamMembersCount / 2);
    const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

    const users = selectedTeam.users.flatMap((teamUser) => {
      if (teamUser.role !== TeamUserRoles.STAKEHOLDER) return [];
      return [
        {
          user: teamUser.user._id,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
        },
      ];
    });

    if (previousTeam !== selectedTeam.id) {
      setCreateBoardData((prev) => ({
        ...prev,
        users,
        board: { ...prev.board, dividedBoards: handleSplitBoards(2) },
        count: {
          ...prev.count,
          teamsCount,
          maxUsersCount,
        },
      }));
    }
  }, [handleSplitBoards, previousTeam, selectedTeam, setCreateBoardData, teamMembersCount]);

  useEffect(() => {
    if (routerTeam) {
      setValue('team', routerTeam);
    }

    setHaveError(numberOfTeams <= 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfTeams]);

  useEffect(() => {
    if (selectedTeam) {
      const canNotCreateBoard = verifyIfCanCreateBoard();

      setHaveError(canNotCreateBoard);

      if (!canNotCreateBoard) {
        createBoard();
      }
    }
  }, [routerTeam, createBoard, selectedTeam, setHaveError, verifyIfCanCreateBoard]);

  return (
    <Flex direction="column" css={{ width: '100%' }}>
      <Select
        disabled={numberOfTeams === 0}
        hasError={currentSelectTeamState === 'error'}
        defaultValue={teamsNames.find((option) => option.value === selectedTeam?.id)?.value}
        onValueChange={(selectedOption: string) => {
          handleTeamChange(selectedOption);
        }}
        css={{ width: '100%', height: '$64' }}
      >
        <SelectTrigger css={{ padding: '$24' }}>
          <Flex direction="column">
            <Text size={selectedTeam ? 'sm' : 'md'} color="primary300">
              {numberOfTeams === 0 ? 'No teams available' : 'Select Team'}
            </Text>
            <SelectValue />
          </Flex>
          <SelectIcon className="SelectIcon" asChild>
            <Icon name="arrow-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent options={teamsNames} />
      </Select>
      {numberOfTeams === 0 && (
        <Flex justify="start">
          <HelperTextWrapper css={{ mt: '$8' }} gap="4">
            <Icon css={{ width: '$24', height: '$24' }} name="info" />

            <Text hint color="dangerBase">
              In order to create a team board, you must be team-admin or stakeholder of at least one
              team.
            </Text>
          </HelperTextWrapper>
        </Flex>
      )}

      <Flex justify={!isHelperEmpty ? 'between' : 'end'}>
        {!isHelperEmpty && (
          <HelperTextWrapper css={{ mt: '$8' }} gap="4">
            {currentSelectTeamState === 'error' && (
              <Icon css={{ width: '$24', height: '$24' }} name="info" />
            )}
            {!isHelperEmpty && (
              <Text hint color={currentSelectTeamState === 'error' ? 'dangerBase' : 'primary300'}>
                {message}
              </Text>
            )}
          </HelperTextWrapper>
        )}
      </Flex>
    </Flex>
  );
};

export default SelectTeam;
