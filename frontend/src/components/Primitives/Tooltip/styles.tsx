import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { styled } from 'styles/stitches/stitches.config';

const StyledContent = styled(TooltipPrimitive.Content, {
	variants: {
		color: {
			primary800: {
				backgroundColor: '$primary800',
				color: '$white'
			},
			primary700: {
				backgroundColor: '$primary700',
				color: '$white'
			},
			primary600: {
				backgroundColor: '$primary600',
				color: '$white'
			},
			primary500: {
				backgroundColor: '$primary500',
				color: '$white'
			},
			primary100: {
				backgroundColor: '$primary100',
				color: '$primary900'
			}
		}
	},

	defaultVariants: {
		color: 'primary800'
	},

	p: '$8',
	borderRadius: '$12',
	maxWidth: '260px',
	fontSize: '$12',
	lineHeight: '$16',
	textAlign: 'center',
	border: 'none',
	minWidth: '141px'
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
	variants: {
		color: {
			primary800: {
				fill: '$primary800'
			},
			primary700: {
				fill: '$primary700'
			},
			primary600: {
				fill: '$primary600'
			},
			primary500: {
				fill: '$primary500'
			},
			primary100: {
				fill: '$primary100'
			}
		}
	},

	defaultVariants: {
		color: 'primary800'
	}
});

export { StyledArrow, StyledContent };
