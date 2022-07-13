import Icon from 'components/icons/Icon';
import { Popover, PopoverContent } from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';
import { PopoverItemStyled, PopoverTriggerStyled } from './styles';

type Props = {
	setFilter: (value: 'desc' | 'asc' | undefined) => void;
	filter: 'desc' | 'asc' | undefined;
	disabled?: boolean;
};

const SortMenu = ({ setFilter, filter, disabled }: Props) => {
	/**
	 * Make a switch case to set icon
	 * by current filter
	 */
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
			<PopoverTriggerStyled disabled={disabled}>
				<Icon name={icon} size={24} />
			</PopoverTriggerStyled>
			{!disabled && (
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
			)}
		</Popover>
	);
};

SortMenu.defaultProps = {
	disabled: false
};

export { SortMenu };
