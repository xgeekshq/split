import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from '@/components/Primitives/Inputs/Select/Select';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { MIN_MEMBERS } from '@/constants';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useTeams from '@/hooks/teams/useTeams';
import useCreateBoard from '@/hooks/useCreateBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { Team } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';

type SelectTeamProps = {
  previousTeam?: string;
};

const SelectTeam = ({ previousTeam }: SelectTeamProps) => {
  const { userId, isSAdmin } = useCurrentSession({ required: true });
  const router = useRouter();
  const routerTeam = router.query.team as string;

  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const setHaveError = useSetRecoilState(createBoardError);
  const { handleSplitBoards, setCreateBoardData, teamMembers } = useCreateBoard(selectedTeam);
  const {
    fetchAllTeams: { data, isError },
    handleErrorOnFetchAllTeams,
  } = useTeams(isSAdmin);
  const teams = data ?? [];

  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const hasPermissions = (team: Team) =>
    isSAdmin ||
    team.users.find(
      (teamUser) =>
        teamUser.user._id === userId &&
        [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
    );
  const availableTeams = teams.filter((team) => hasPermissions(team));

  const teamMembersCount = teamMembers?.length ?? 0;
  const message =
    availableTeams.length === 0
      ? ' In order to create a team board, you must be team-admin or stakeholder of at least one team.'
      : (errors.team?.message as string);
  const isHelperEmpty = isEmpty(message);
  const isValueEmpty = isEmpty(getValues('team'));

  const currentSelectTeamState = useMemo(() => {
    if (message) return 'error';
    if (isValueEmpty) return 'default';
    if (!message && !isValueEmpty) return 'valid';

    return undefined;
  }, [message, isValueEmpty]);

  const handleTeamChange = (value: string) => {
    clearErrors();
    const foundTeam = teams.find((team) => team.id === value);

    if (!foundTeam) return;

    setValue('team', foundTeam.id);
    setSelectedTeam(foundTeam);
  };

  const teamsNames = useMemo(
    () =>
      availableTeams.map((team) => ({
        label: `${team.name} (${team.users.length} members)`,
        value: team.id,
      })),
    [availableTeams],
  );

  const verifyIfCanCreateBoard = () => {
    if (!selectedTeam) {
      return false;
    }

    const haveMinMembers =
      selectedTeam.users.filter((user) => user.role !== TeamUserRoles.STAKEHOLDER).length >=
      MIN_MEMBERS;

    return haveMinMembers;
  };

  const createBoard = useCallback(() => {
    if (!selectedTeam) return;

    const maxUsersCount = Math.ceil(teamMembersCount / 2);
    const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

    const users = selectedTeam.users.flatMap((teamUser) => {
      if (teamUser.role !== TeamUserRoles.STAKEHOLDER) return [];

      return [
        {
          user: teamUser.user,
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
    if (selectedTeam) {
      const canCreateBoard = verifyIfCanCreateBoard();
      setHaveError(!canCreateBoard);

      if (canCreateBoard) {
        createBoard();
      }
    }
  }, [routerTeam, selectedTeam, verifyIfCanCreateBoard, createBoard]);

  useEffect(() => {
    if (routerTeam) {
      setValue('team', routerTeam);
    }

    setHaveError(availableTeams.length <= 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isError) {
    handleErrorOnFetchAllTeams();
  }

  return (
    <Flex css={{ flex: 1 }} direction="column">
      <Select
        css={{ width: '100%', height: '$64' }}
        defaultValue={teamsNames.find((option) => option.value === selectedTeam?.id)?.value}
        disabled={availableTeams.length === 0}
        hasError={currentSelectTeamState === 'error'}
        onValueChange={(selectedOption: string) => {
          handleTeamChange(selectedOption);
        }}
      >
        <SelectTrigger css={{ padding: '$24' }}>
          <Flex direction="column">
            <Text color="primary300" size={selectedTeam ? 'sm' : 'md'}>
              {availableTeams.length === 0 ? 'No teams available' : 'Select Team'}
            </Text>
            <SelectValue />
          </Flex>
          <SelectIcon className="SelectIcon">
            <Icon name="arrow-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent options={teamsNames} />
      </Select>
      {!isHelperEmpty && (
        <Flex css={{ mt: '$8', color: '$dangerBase' }} gap={4} justify="start">
          {currentSelectTeamState === 'error' && <Icon name="info" size={16} />}
          <Text hint color={currentSelectTeamState === 'error' ? 'dangerBase' : 'primary300'}>
            {message}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SelectTeam;
