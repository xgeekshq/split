import React, { useCallback, useEffect, useMemo } from 'react';
import Icon from '@/components/icons/Icon';
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
import { OptionType } from '@/components/Boards/Filters/FilterBoards';
import { components, ControlProps } from 'react-select';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import useCreateBoard from '@/hooks/useCreateBoard';
import { useRouter } from 'next/router';
import { HelperTextWrapper, selectStyles, StyledBox, StyledSelect } from './styles';

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}>
    <Flex direction="column" css={{ width: '100%', px: '$17' }}>
      {(props.selectProps.value as { label: string; value: string }).label && (
        <Text color="primary300" size="xs">
          Select Team
        </Text>
      )}

      <Flex css={{ width: '100%' }}>{children}</Flex>
    </Flex>
  </components.Control>
);

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

  const teamMembersCount = teamMembers?.length ?? 0;

  const currentSelectTeamState = useMemo(() => {
    if (message) return 'error';
    if (isValueEmpty) return 'default';
    if (!message && !isValueEmpty) return 'valid';
    return undefined;
  }, [message, isValueEmpty]);

  const isHelperEmpty = isEmpty(message);

  const handleTeamChange = (value: string) => {
    clearErrors();
    const foundTeam = teams.find((team) => team._id === value);

    setValue('team', foundTeam?._id);

    setSelectedTeam(foundTeam);
  };

  const teamsNames = useMemo(
    () =>
      teams.map((team) => ({
        label: `${team.name} (${team.users.length} members)`,
        value: team._id,
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

    const isAdminOrStakeholder =
      !!selectedTeam.users?.find(
        (teamUser) =>
          teamUser.user._id === session?.user.id &&
          [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
      ) || session?.user.isSAdmin;

    return !haveMinMembers || !isAdminOrStakeholder;
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

    if (previousTeam !== selectedTeam._id) {
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
      const foundTeam = teams.find((team) => team._id === routerTeam);
      setSelectedTeam(foundTeam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <StyledBox
        css={{
          minWidth: 0,
          width: '100%',
          py: '$12',
          height: '$64',
          borderRadius: '$4',
          backgroundColor: 'white',
          border:
            currentSelectTeamState === 'error' ? '1px solid $dangerBase' : '1px solid $primary200',
        }}
        direction="column"
        elevation="1"
      >
        <StyledSelect
          components={{
            IndicatorSeparator: () => null,
            Control,
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: '#A9B3BF',
              primary50: 'white',
              primary: 'black',
              text: '#060D16',
            },
          })}
          styles={selectStyles}
          options={teamsNames}
          placeholder="Select Team"
          controlShouldRenderValue={!!selectedTeam}
          defaultValue={{ label: selectedTeam?.name, value: selectedTeam?._id }}
          value={teamsNames.find((option) => option.value === selectedTeam?._id)}
          onChange={(selectedOption) => {
            handleTeamChange((selectedOption as OptionType)?.value);
          }}
        />
      </StyledBox>
      <Flex justify={!isHelperEmpty ? 'between' : 'end'}>
        {!isHelperEmpty && (
          <HelperTextWrapper css={{ mt: '$8' }} gap="4">
            {currentSelectTeamState === 'error' && (
              <Icon css={{ width: '$24', height: '$24' }} name="info" />
            )}
            <Text
              hint
              css={{
                color: currentSelectTeamState === 'error' ? '$dangerBase' : '$primary300',
              }}
            >
              {message}
            </Text>
          </HelperTextWrapper>
        )}
      </Flex>
    </Flex>
  );
};

export default SelectTeam;
