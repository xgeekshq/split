import React, { useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  StyledItem,
  StyledItemIndicator,
} from '@/components/Primitives/Select';
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
import { HelperTextWrapper, StyledBox } from './styles';

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
          width: '100%',
          py: '$12',
          pl: '$17',
          pr: '$16',
          height: '$64',
          borderRadius: '$4',
          backgroundColor: 'white',
          border: currentState === 'error' ? '1px solid $dangerBase' : '1px solid $primary200',
        }}
        direction="column"
        elevation="1"
      >
        {selectedTeam && (
          <Text color="primary300" size="xs">
            Select Team
          </Text>
        )}
        <Select onValueChange={handleTeamChange}>
          <SelectTrigger aria-label="Teams">
            <SelectValue placeholder="Select Team" />
            <SelectIcon>
              <Icon
                name="arrow-down"
                css={{
                  width: '$20',
                  height: '$20',
                }}
              />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectContent>
              <SelectViewport>
                {teams.map((team) => (
                  <StyledItem value={team._id} key={team._id}>
                    <SelectItemText>
                      {team.name} <Text color="primary300">({team.users.length} members)</Text>
                    </SelectItemText>
                    <StyledItemIndicator>
                      <Icon
                        name="check"
                        css={{
                          width: '$20',
                          height: '$20',
                        }}
                      />
                    </StyledItemIndicator>
                  </StyledItem>
                ))}
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </Select>
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
