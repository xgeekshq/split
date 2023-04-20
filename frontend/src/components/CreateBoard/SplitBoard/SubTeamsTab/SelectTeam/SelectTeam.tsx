import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';

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
import useTeams from '@/hooks/teams/useTeams';
import useCreateBoard from '@/hooks/useCreateBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { Team } from '@/types/team/team';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';

type SelectTeamProps = {
  previousTeam?: string;
};

const SelectTeam = ({ previousTeam }: SelectTeamProps) => {
  const { userId, isSAdmin } = useCurrentSession({ required: true });
  const router = useRouter();
  const routerTeam = router.query.team as string;

  const setHaveError = useSetRecoilState(createBoardError);
  const { handleSplitBoards, createBoardData, setCreateBoardData } = useCreateBoard();
  const teamsQuery = useTeams(isSAdmin);
  const teams = teamsQuery.data ?? [];

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

  const teamsNames = useMemo(
    () =>
      availableTeams.map((team) => ({
        label: `${team.name} (${team.users.length} members)`,
        value: team.id,
      })),
    [availableTeams],
  );

  const createBoard = useCallback(() => {
    const teamMembersCount = createBoardData.team?.users.length ?? 0;
    const maxUsersCount = Math.ceil(teamMembersCount / 2);
    const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

    const users =
      createBoardData.team?.users.flatMap((teamUser) => {
        if (teamUser.role !== TeamUserRoles.STAKEHOLDER) return [];

        return [
          {
            user: teamUser.user,
            role: BoardUserRoles.MEMBER,
            votesCount: 0,
          },
        ];
      }) ?? [];

    console.log('4 -> ', users);
    console.log(previousTeam, createBoardData.team);

    // if (previousTeam !== createBoardData.team?.id) {
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
    // }
  }, [handleSplitBoards, previousTeam, setCreateBoardData, createBoardData.team]);

  const handleTeamChange = (value: string) => {
    clearErrors();
    const foundTeam = teams.find((team) => team.id === value);

    if (!foundTeam) return;

    setValue('team', foundTeam.id);
    setCreateBoardData((prev) => ({
      ...prev,
      team: foundTeam,
      board: { ...prev.board, team: foundTeam.id },
    }));

    console.log('1 -> ', foundTeam);
  };

  // useEffect(() => {
  //   if (selectedTeam) {
  //     const canCreateBoard = verifyIfCanCreateBoard();
  //     setHaveError(!canCreateBoard);

  //     if (canCreateBoard) {
  //       createBoard();
  //     }
  //   }
  // }, [routerTeam, selectedTeam, verifyIfCanCreateBoard, createBoard]);

  useEffect(() => {
    if (!createBoardData.team) return;

    console.log('2 -> ', createBoardData.team);

    const haveMinMembers =
      createBoardData.team.users.filter((user) => user.role !== TeamUserRoles.STAKEHOLDER).length >=
      MIN_MEMBERS;
    setHaveError(!haveMinMembers);

    console.log('3 -> ', haveMinMembers);

    if (haveMinMembers) createBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBoardData.team]);

  useEffect(() => {
    if (routerTeam) {
      setValue('team', routerTeam);
    }

    setHaveError(availableTeams.length <= 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex css={{ flex: 1 }} direction="column">
      <Select
        css={{ width: '100%', height: '$64' }}
        defaultValue={teamsNames.find((option) => option.value === createBoardData.team?.id)?.value}
        disabled={availableTeams.length === 0}
        hasError={currentSelectTeamState === 'error'}
        onValueChange={(selectedOption: string) => {
          handleTeamChange(selectedOption);
        }}
      >
        <SelectTrigger css={{ padding: '$24' }}>
          <Flex direction="column">
            <Text color="primary300" size={createBoardData.team ? 'sm' : 'md'}>
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
