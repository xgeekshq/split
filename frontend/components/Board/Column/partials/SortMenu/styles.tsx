import { styled } from '../../../../../stitches.config';
import { PopoverItem, PopoverTrigger } from '../../../../Primitives/Popover';

const PopoverTriggerStyled = styled(PopoverTrigger, {
	cursor: 'pointer',

	'&:svg': {
		size: '$24',
		color: '$primary300'
	},

	'&:hover,&[data-state="open"]': {
		backgroundColor: '$primary100',
		color: '$primary300'
	}
});

const PopoverItemStyled = styled(PopoverItem, {
	variants: {
		active: {
			true: {
				backgroundColor: '$primary100',
				color: '$primary800'
			},
			false: {}
		},
		sorting: {
			true: {
				'&:hover': {
					backgroundColor: '$primary50',
					'&>*': { color: '$primary800 !important' }
				}
			},
			false: {
				'&>svg': { color: '$primary300' },

				'&:hover': {
					backgroundColor: '$primary50',
					'&>span': { color: '$primary800 !important' },
					'&>svg': { color: '$primary300 !important' }
				}
			}
		}
	},

	defaultVariants: {
		sorting: true,
		active: false
	},

	alignItems: 'center',
	gap: '$8'
});

export { PopoverItemStyled, PopoverTriggerStyled };
