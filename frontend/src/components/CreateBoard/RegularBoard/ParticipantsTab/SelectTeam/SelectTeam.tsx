import { useCallback, useEffect, useMemo } from 'react';
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
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useTeams from '@/hooks/teams/useTeams';
import useCreateBoard from '@/hooks/useCreateBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/user.atom';
import { Team } from '@/types/team/team';
import { UserList } from '@/types/team/userList';

const SelectTeam = () => {
  const { userId, isSAdmin } = useCurrentSession();
  const router = useRouter();
  const routerTeam = router.query.team as string;

  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const setUsersList = useSetRecoilState(usersListState);
  const { setCreateBoardData } = useCreateBoard(selectedTeam);
  const {
    fetchAllTeams: { data, isError },
    handleErrorOnFetchAllTeams,
  } = useTeams(isSAdmin);
  const teams = data ?? [];

  const hasPermissions = (team: Team) =>
    isSAdmin ||
    team.users.find(
      (teamUser) =>
        teamUser.user._id === userId &&
        [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
    );
  const availableTeams = teams.filter((team) => hasPermissions(team));

  const teamsNames = useMemo(
    () =>
      availableTeams.map((team) => ({
        label: `${team.name} (${team.users.length} members)`,
        value: team.id,
      })),
    [availableTeams],
  );

  const createBoard = useCallback(() => {
    if (!selectedTeam) {
      return;
    }

    const users = selectedTeam.users.flatMap((teamUser) => {
      if (
        teamUser.role === TeamUserRoles.STAKEHOLDER ||
        teamUser.user._id === userId ||
        teamUser.role === TeamUserRoles.ADMIN
      )
        return [
          {
            user: teamUser.user,
            role: BoardUserRoles.RESPONSIBLE,
            votesCount: 0,
          },
        ];
      return [
        {
          user: teamUser.user,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
        },
      ];
    });

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: selectedTeam.id },
    }));

    setUsersList((prev) =>
      prev.map((user: UserList) => ({
        ...user,
        isChecked: selectedTeam.users.some((teamUser) => teamUser.user._id === user._id),
      })),
    );
  }, [selectedTeam, userId, setCreateBoardData]);

  const handleTeamChange = (value: string) => {
    const foundTeam = availableTeams.find((team) => team.id === value);

    setSelectedTeam(foundTeam);
  };

  useEffect(() => {
    if (routerTeam) {
      const foundTeam = availableTeams.find((team) => team.id === routerTeam);
      setSelectedTeam(foundTeam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      createBoard();
    }
  }, [routerTeam, createBoard, selectedTeam]);

  if (isError) {
    handleErrorOnFetchAllTeams();
  }

  return (
    <Flex css={{ flex: 1 }} direction="column">
      <Select
        css={{ width: '100%', height: '$64' }}
        defaultValue={teamsNames.find((option) => option.value === selectedTeam?.id)?.value}
        disabled={availableTeams.length === 0}
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
      {availableTeams.length === 0 && (
        <Flex align="center" css={{ mt: '$8', color: '$dangerBase' }} gap="4" justify="start">
          <Icon name="info" size={16} />
          <Text hint color="dangerBase">
            In order to create a team board, you must be team-admin or stakeholder of at least one
            team.
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SelectTeam;
