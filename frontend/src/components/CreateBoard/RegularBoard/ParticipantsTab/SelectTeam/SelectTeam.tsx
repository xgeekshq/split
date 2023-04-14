import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
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
import useTeams from '@/hooks/teams/useTeams';
import useCreateBoard from '@/hooks/useCreateBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { Team } from '@/types/team/team';
import { UserList } from '@/types/team/userList';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

const SelectTeam = () => {
  const { userId, isSAdmin } = useCurrentSession();
  const router = useRouter();
  const routerTeam = router.query.team as string;

  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const setUsersList = useSetRecoilState(usersListState);
  const { setCreateBoardData } = useCreateBoard(selectedTeam);
  const teamsQuery = useTeams(isSAdmin);
  const teams = teamsQuery.data ?? [];

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

  return (
    <Flex direction="column" css={{ flex: 1 }}>
      <Select
        disabled={availableTeams.length === 0}
        defaultValue={teamsNames.find((option) => option.value === selectedTeam?.id)?.value}
        onValueChange={(selectedOption: string) => {
          handleTeamChange(selectedOption);
        }}
        css={{ width: '100%', height: '$64' }}
      >
        <SelectTrigger css={{ padding: '$24' }}>
          <Flex direction="column">
            <Text size={selectedTeam ? 'sm' : 'md'} color="primary300">
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
        <Flex justify="start" align="center" gap="4" css={{ mt: '$8', color: '$dangerBase' }}>
          <Icon size={16} name="info" />
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
