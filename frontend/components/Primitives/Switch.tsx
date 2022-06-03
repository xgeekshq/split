import * as SwitchPrimitive from '@radix-ui/react-switch';

import { styled } from '../../stitches.config';
import Flex from './Flex';

const StyledSwitch = styled(SwitchPrimitive.Root, {
	all: 'unset',
	width: 42,
	height: 24,
	display: 'flex',
	backgroundColor: '$primary200',
	borderRadius: '9999px',
	position: 'relative',
	cursor: 'pointer',
	WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
	'&[data-state="checked"]': { backgroundColor: '$successBase' },
	boxSizing: 'border-box'
});

const StyledThumb = styled(SwitchPrimitive.Thumb, Flex, {
	justifyContent: 'center',
	alignItems: 'center',
	width: 21,
	height: 21,
	top: '50%',
	position: 'absolute',
	backgroundColor: 'white',
	borderRadius: '9999px',
	transition: 'transform 100ms',
	transform: 'translate(5%, -50%)',
	willChange: 'transform',
	cursor: 'pointer',
	'&[data-state="checked"]': { transform: 'translate(90%, -50%)' }
});

export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;
