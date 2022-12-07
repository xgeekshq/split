import React from 'react';
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
import { useRecoilState, useRecoilValue } from 'recoil';
import { createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { StyledBox } from './styles';

export const SelectTeam = () => {
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);

  const teams = useRecoilValue(teamsOfUser);

  const handleTeamChange = (value: string) => {
    const foundTeam = teams.find((team) => team._id === value);

    setSelectedTeam(foundTeam);
  };

  return (
    <StyledBox
      css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
      direction="column"
      elevation="1"
    >
      {selectedTeam && (
        <Text color="primary300" size="xs">
          Select Team
        </Text>
      )}
      <Select onValueChange={handleTeamChange}>
        <SelectTrigger aria-label="Food">
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
                  <SelectItemText>{team.name}</SelectItemText>
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
  );
};

export default SelectTeam;
