import { styled } from '../../../../styles/stitches/stitches.config';
import Box from '../../../Primitives/Box';
import Flex from '../../../Primitives/Flex';
import { PopoverClose, PopoverItem, PopoverTrigger } from '../../../Primitives/Popover';
import Text from '../../../Primitives/Text';

const InnerContainer = styled(Flex, Box, {
	px: '$32',
	backgroundColor: '$white',
	borderRadius: '$12'
});

const StyledMemberTitle = styled(Text, {
	fontWeight: '$bold',
	fontSize: '$14',
	letterSpacing: '$0-17',
	'&[data-disabled="true"]': { opacity: 0.4 }
});

const PopoverTriggerStyled = styled(PopoverTrigger, {
	variants: {
		disabled: {
			false: {
				'&:hover': {
					backgroundColor: '$primary500',
					color: 'white'
				}
			},
			true: {
				'&:hover': {
					backgroundColor: '$transparent'
				}
			}
		}
	},
	defaultVariants: { disabled: false }
});

const PopoverCloseStyled = styled(PopoverClose, {
	border: 'none',
	backgroundColor: 'transparent',
	padding: 0
});

const PopoverItemStyled = styled(PopoverItem, {
	backgroundColor: '$primary50',
	pr: '$16',
	height: '$100'
});

export {
	InnerContainer,
	PopoverCloseStyled,
	PopoverItemStyled,
	PopoverTriggerStyled,
	StyledMemberTitle
};
