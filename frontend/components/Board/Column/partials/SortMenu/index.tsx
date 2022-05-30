import Icon from '../../../../icons/Icon';
import { Popover, PopoverContent } from '../../../../Primitives/Popover';
import Text from '../../../../Primitives/Text';
import { PopoverItemStyled, PopoverTriggerStyled } from './styles';

type Props = {
	setFilter: (value: 'desc' | 'asc' | undefined) => void;
};

const SortMenu = ({ setFilter }: Props) => {
	return (
		<Popover>
			<PopoverTriggerStyled>
				<Icon name="sort" />
			</PopoverTriggerStyled>
			<PopoverContent>
				<PopoverItemStyled onClick={() => setFilter('desc')}>
					<Icon name="sort_desc" />
					<Text size="sm">Sort by votes (desc)</Text>
				</PopoverItemStyled>
				<PopoverItemStyled onClick={() => setFilter('asc')}>
					<Icon name="sort_asc" />
					<Text size="sm">Sort by votes (asc)</Text>
				</PopoverItemStyled>
				<PopoverItemStyled sorting={false} onClick={() => setFilter(undefined)}>
					<Icon name="sort" />
					<Text size="sm">No sorting</Text>
				</PopoverItemStyled>
			</PopoverContent>
		</Popover>
	);
};

export { SortMenu };
