import * as SwitchPrimitive from '@radix-ui/react-switch';

import { styled } from 'styles/stitches/stitches.config';

import Flex from './Flex';

const StyledSwitch = styled(SwitchPrimitive.Root, {
	all: 'unset',
	display: 'flex',
	backgroundColor: '$primary200',
	borderRadius: '9999px',
	position: 'relative',
	cursor: 'pointer',
	WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
	'&[data-state="checked"]': { backgroundColor: '$successBase' },
	boxSizing: 'border-box',
	variants: {
		variant: {
			sm: {
				flex: '0 0 $sizes$35',
				width: '$35',
				height: '$20'
			},
			md: { flex: '0 0 $sizes$42', width: '$42', height: '$24' }
		}
	},
	defaultVariants: {
		variant: 'md'
	}
});

const StyledThumb = styled(SwitchPrimitive.Thumb, Flex, {
	justifyContent: 'center',
	alignItems: 'center',
	top: '50%',
	position: 'absolute',
	backgroundColor: 'white',
	borderRadius: '9999px',
	transition: 'transform 100ms',
	transform: 'translate(5%, -50%)',
	willChange: 'transform',
	cursor: 'pointer',
	'&[data-state="checked"]': { transform: 'translate(90%, -50%)' },
	variants: {
		variant: {
			sm: {
				width: '$17',
				height: '$17'
			},
			md: { width: '$21', height: '$21' }
		}
	},
	defaultVariants: {
		variant: 'md'
	}
});

export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;
