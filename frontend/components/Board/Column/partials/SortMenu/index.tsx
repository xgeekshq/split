import Icon from '../../../../icons/Icon';
import { Popover, PopoverContent } from '../../../../Primitives/Popover';
import Text from '../../../../Primitives/Text';
import { PopoverItemStyled, PopoverTriggerStyled } from './styles';

type Props = {
	setFilter: (value: 'desc' | 'asc' | undefined) => void;
	filter: 'desc' | 'asc' | undefined;
};

const SortMenu = ({ setFilter, filter }: Props) => {
	let icon;

	switch (filter) {
		case 'asc':
			icon = 'sort_upvoted';
			break;
		case 'desc':
			icon = 'sort_downvoted';
			break;
		default:
			icon = 'sort';
			break;
	}

	return (
		<Popover>
			<PopoverTriggerStyled>
				<Icon name={icon} />
			</PopoverTriggerStyled>
			<PopoverContent>
				<PopoverItemStyled active={filter === 'desc'} onClick={() => setFilter('desc')}>
					<Icon name="sort_desc" />
					<Text size="sm">Sort by votes (desc)</Text>
				</PopoverItemStyled>
				<PopoverItemStyled active={filter === 'asc'} onClick={() => setFilter('asc')}>
					<Icon name="sort_asc" />
					<Text size="sm">Sort by votes (asc)</Text>
				</PopoverItemStyled>
				<PopoverItemStyled
					active={filter === undefined}
					sorting={false}
					onClick={() => setFilter(undefined)}
				>
					<Icon name="sort" />
					<Text size="sm">No sorting</Text>
				</PopoverItemStyled>
			</PopoverContent>
		</Popover>
	);
};

export { SortMenu };
