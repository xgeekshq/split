import React, { useCallback, useEffect, useMemo } from 'react';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text/Text';
import { teamsOfUser } from '@/store/team/atom/team.atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Layout/Flex';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import useCreateBoard from '@/hooks/useCreateBoard';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
} from '@/components/Primitives/Inputs/Select/Select';
import { HelperTextWrapper } from '../../SplitBoard/SubTeamsTab/SelectTeam/styles';

const SelectTeam = () => {
  const router = useRouter();
  const routerTeam = router.query.team as string;

  const { data: session } = useSession();

  /**
   * Recoil Atoms and Hooks
   */
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const teams = useRecoilValue(teamsOfUser);
  const { setCreateBoardData, teamMembers } = useCreateBoard(selectedTeam);

  const teamMembersCount = teamMembers?.length ?? 0;
  const numberOfTeams = teams?.length ?? 0;

  const handleTeamChange = (value: string) => {
    const foundTeam = teams.find((team) => team.id === value);

    setSelectedTeam(foundTeam);
  };

  const teamsNames = useMemo(
    () =>
      teams.map((team) => ({
        label: `${team.name} (${team.users.length} members)`,
        value: team.id,
      })),
    [teams],
  );

  const createBoard = useCallback(() => {
    if (!selectedTeam) {
      return;
    }
    const maxUsersCount = Math.ceil(teamMembersCount / 2);
    const teamsCount = Math.ceil(teamMembersCount / maxUsersCount);

    const users = selectedTeam.users.flatMap((teamUser) => {
      if (teamUser.role === TeamUserRoles.STAKEHOLDER || teamUser.user._id === session?.user.id)
        return [
          {
            user: teamUser.user._id,
            role: BoardUserRoles.RESPONSIBLE,
            votesCount: 0,
          },
        ];
      return [
        {
          user: teamUser.user._id,
          role: BoardUserRoles.MEMBER,
          votesCount: 0,
        },
      ];
    });

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: selectedTeam.id },
      count: {
        ...prev.count,
        teamsCount,
        maxUsersCount,
      },
    }));
  }, [selectedTeam, session?.user.id, setCreateBoardData, teamMembersCount]);

  useEffect(() => {
    if (routerTeam) {
      const foundTeam = teams.find((team) => team.id === routerTeam);
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
    <Flex direction="column" css={{ width: '100%' }}>
      <Select
        disabled={numberOfTeams === 0}
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
    </Flex>
  );
};

export default SelectTeam;
