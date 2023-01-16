import { styled } from '@/styles/stitches/stitches.config';

import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import FilterSelect from './FilterSelect';

export interface OptionType {
  value: string;
  label: string;
}

const StyledButton = styled(Button, {
  border: '1px solid $colors$primary100',
  borderRadius: '0px',
  height: '$36 !important',
  backgroundColor: '$white !important',
  color: '$primary300 !important',
  fontSize: '$14 !important',
  lineHeight: '$20 !important',
  fontWeight: '$medium !important',
  '&[data-active="true"]': {
    borderColor: '$primary800',
    color: '$primary800 !important',
  },
  '&:active': {
    boxShadow: 'none !important',
  },
});

interface FilterBoardsProps {
  teamNames: OptionType[];
}

const FilterBoards: React.FC<FilterBoardsProps> = ({ teamNames }) => {
  const [filterState, setFilterState] = useRecoilState(filterTeamBoardsState);
  return (
    <Flex css={{ zIndex: '10' }} justify="end">
      <StyledButton
        css={{ borderRadius: '12px 0 0 12px' }}
        data-active={filterState === 'all'}
        onClick={() => setFilterState('all')}
      >
        All
      </StyledButton>
      <StyledButton
        data-active={filterState === 'personal'}
        onClick={() => setFilterState('personal')}
      >
        Personal
      </StyledButton>
      <FilterSelect options={teamNames} />
    </Flex>
  );
};

export default FilterBoards;
