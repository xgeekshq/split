import * as PopoverPrimitive from '@radix-ui/react-popover';

import { styled } from '../../../stitches.config';

const StyledHeader = styled('div', {
	width: '100%',
	maxHeight: '108px',

	position: 'relative',

	padding: '$24 $37',
	borderBottomStyle: 'solid',
	borderBottomWidth: 1,
	borderBottomColor: '$primary100',

	backgroundColor: '$surface'
});

const StyledLogo = styled('div', {
	'& svg': {
		width: 16,
		height: 16
	},

	display: 'inline-flex',
	alignItems: 'center'
});

const TitleSection = styled('section', {
	display: 'flex',
	alignItems: 'center',
	gap: '$10'
});

const MergeIconContainer = styled('div', {
	variants: {
		isMerged: {
			true: {
				color: '$successBase'
			},
			false: {
				color: '$danger500'
			}
		}
	},

	lineHeight: '$20',

	'& svg': {
		width: '$20',
		height: '$20'
	}
});

const BoardCounter = styled('button', {
	position: 'absolute',
	top: 0,
	left: '50%',
	transform: 'translateX(-50%)',

	display: 'flex',
	alignItems: 'center',
	gap: '$6',
	justifyContent: 'center',

	padding: '$6 $12',
	borderRadius: '0 0 $12 $12',
	backgroundColor: '$infoLightest',
	boxShadow: 'none',
	border: 0,

	textAlign: 'center',
	fontSize: '$12',
	lineHeight: '$16',
	color: '$infoLight',

	transition: 'all 0.2s ease-in-out',
	cursor: 'pointer',

	'&[data-state="open"],&:hover': {
		backgroundColor: '$infoLighter',
		color: '$infoDark'
	},

	'& svg': {
		width: '$12',
		height: '$12'
	}
});

const StyledPopoverContent = styled(PopoverPrimitive.Content, {
	borderRadius: '$12',
	padding: '$20 0',
	minWidth: 260,
	color: 'white',
	backgroundColor: '$primary800',
	boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)'
});

const StyledPopoverArrow = styled(PopoverPrimitive.Arrow, {
	fill: '$primary800'
});

const StyledPopoverItem = styled('div', {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '$10',

	padding: '$8 $16',

	transition: 'background-color 0.2s ease-in-out',
	cursor: 'default',

	'&>p': {
		flex: '1 1 auto',

		margin: 0,

		fontSize: '$14',
		color: 'white'
	},

	'> div': {
		display: 'flex',
		alignItems: 'center',
		gap: '$6',

		color: '$primary200',
		fontSize: '$12',

		div: {
			lineHeight: '$12'
		},

		'& svg': {
			width: '$12',
			height: '$12'
		}
	},

	'&:hover': {
		backgroundColor: '$primary700'
	}
});

const StyledBoardLink = styled('a', {
	color: '$primary300',

	textDecoration: 'none',
	fontSize: '$14',

	cursor: 'pointer',
	transition: 'color 0.2s ease-in-out',

	'&:hover': {
		color: '$primary500'
	}
});

const RecurrentIconContainer = styled('div', {
	width: '$12',
	height: '$12',

	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',

	borderRadius: '$round',

	backgroundColor: '$primary800',
	color: 'white',

	cursor: 'pointer',

	svg: {
		width: '$8',
		height: '$8'
	}
});

export {
	BoardCounter,
	MergeIconContainer,
	RecurrentIconContainer,
	StyledBoardLink,
	StyledHeader,
	StyledLogo,
	StyledPopoverArrow,
	StyledPopoverContent,
	StyledPopoverItem,
	TitleSection
};
