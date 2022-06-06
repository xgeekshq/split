import { Dispatch, SetStateAction } from 'react';

import { styled } from 'styles/stitches/stitches.config';

import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';
import FilterSelect from './FilterSelect';

export interface OptionType {
	value: string;
	label: string;
}

const StyledButton = styled(Button, {
	border: '1px solid $colors$primary100',
	borderRadius: '0px',
	height: '$36 !important',
	backgroundColor: '$background !important',
	color: '$primary300 !important',
	fontSize: '$14 !important',
	lineHeight: '$20 !important',
	fontWeight: '$medium !important',
	'&[data-active="true"]': {
		borderColor: '$primary800',
		color: '$primary800 !important'
	},
	'&:active': {
		boxShadow: 'none !important'
	}
});

interface FilterBoardsProps {
	setFilter: Dispatch<SetStateAction<string>>;
	filter: string;
	teamNames: OptionType[];
}

const FilterBoards: React.FC<FilterBoardsProps> = ({ setFilter, filter, teamNames }) => {
	return (
		<Flex justify="end" css={{ zIndex: '10' }}>
			<StyledButton
				css={{ borderRadius: '12px 0 0 12px' }}
				data-active={filter === 'all'}
				onClick={() => setFilter('all')}
			>
				All
			</StyledButton>
			<StyledButton data-active={filter === 'personal'} onClick={() => setFilter('personal')}>
				Personal
			</StyledButton>
			<FilterSelect filter={filter} options={teamNames} setFilter={setFilter} />
		</Flex>
	);
};

export default FilterBoards;
