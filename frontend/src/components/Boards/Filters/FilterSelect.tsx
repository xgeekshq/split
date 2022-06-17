import { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

import { styled } from 'styles/stitches/stitches.config';

const StyledSelect = styled(Select, {});

interface OptionType {
	value: string;
	label: string;
}

interface FilterSelectProps {
	options: OptionType[];
	setFilter: Dispatch<SetStateAction<string>>;
	filter: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ filter, options, setFilter }) => {
	const isSelected = filter !== 'all' && filter !== 'personal';
	return (
		<StyledSelect
			options={options}
			className="react-select-container"
			classNamePrefix="react-select"
			value={
				!isSelected
					? { label: 'Select', value: '' }
					: options.find((option) => option.value === filter)
			}
			onChange={(selectedOption) => {
				setFilter((selectedOption as OptionType)?.value);
			}}
		/>
	);
};

export default FilterSelect;
