import React, { useEffect, useMemo } from 'react';
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
import { HelperTextWrapper, selectStyles, StyledBox, StyledSelect } from './styles';

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props}>
    <Flex direction="column" css={{ width: '100%' }}>
      {(props.selectProps.value as { label: string; value: string }).label && (
        <Text color="primary300" size="xs">
          Select Team
        </Text>
      )}

      <Flex css={{ width: '100%' }}>{children}</Flex>
    </Flex>
  </components.Control>
);

const SelectTeam = () => {
  const { data: session } = useSession({ required: true });

  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  /**
   * Recoil Atoms and Hooks
   */
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const setHaveError = useSetRecoilState(createBoardError);
  const teams = useRecoilValue(teamsOfUser);

  const message = errors.team?.message;
  const teamValueOnForm = getValues().team;
  const isValueEmpty = isEmpty(teamValueOnForm);

  const currentState = useMemo(() => {
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

  useEffect(() => {
    if (selectedTeam) {
      const haveMinMembers = !!(
        selectedTeam.users?.filter((user) => user.role !== TeamUserRoles.STAKEHOLDER).length >=
        MIN_MEMBERS
      );

      const isAdminOrStakeholder = selectedTeam
        ? !!selectedTeam.users.find(
            (teamUser) =>
              teamUser.user._id === session?.user.id &&
              [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
          ) || session?.user.isSAdmin
        : false;

      setHaveError(!isAdminOrStakeholder || !haveMinMembers);
    }
  }, [selectedTeam, session?.user.id, session?.user.isSAdmin, setHaveError]);

  return (
    <Flex direction="column" css={{ width: '100%' }}>
      <StyledBox
        css={{
          minWidth: 0,
          width: '100%',
          pl: '$17',
          pr: '$16',
          py: '$12',
          height: '$64',
          borderRadius: '$4',
          backgroundColor: 'white',
          border: currentState === 'error' ? '1px solid $dangerBase' : '1px solid $primary200',
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
          value={teamsNames.find((option) => option.value === selectedTeam?.name)}
          onChange={(selectedOption) => {
            handleTeamChange((selectedOption as OptionType)?.value);
          }}
        />
      </StyledBox>
      <Flex justify={!isHelperEmpty ? 'between' : 'end'}>
        {!isHelperEmpty && (
          <HelperTextWrapper css={{ mt: '$8' }} gap="4">
            {currentState === 'error' && <Icon css={{ width: '$24', height: '$24' }} name="info" />}
            <Text
              hint
              css={{
                color: currentState === 'error' ? '$dangerBase' : '$primary300',
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
