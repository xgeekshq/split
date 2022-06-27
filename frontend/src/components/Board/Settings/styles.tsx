import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { keyframes, styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import Button from 'components/Primitives/Button';
import Flex from 'components/Primitives/Flex';

/**
 * Dialog Animations
 */
const overlayShow = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 }
});

const contentShow = keyframes({
	'0%': { opacity: 0, transform: 'translateX(100%)' },
	'100%': { opacity: 1, transform: 'translateX(0%)' }
});

/**
 * Dialog Styles
 */
const StyledDialogOverlay = styled(DialogPrimitive.Overlay, {
	backgroundColor: 'rgba(0,0,0,0.75)',
	position: 'fixed',
	inset: 0,
	zIndex: 1,
	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
	}
});

const StyledDialogContent = styled(DialogPrimitive.Content, {
	position: 'fixed',
	top: 0,
	right: 0,

	height: '100vh',
	width: '592px',

	padding: 0,

	backgroundColor: 'white',
	zIndex: 10,

	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
	},

	'&:focus': { outline: 'none' },

	'& form': {
		padding: '$24 $32'
	}
});

const StyledDialogTitle = styled('div', DialogPrimitive.Title, {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',

	px: '$32',
	py: '$24',

	borderBottom: '1px solid $colors$primary100',

	'&>h2': {
		margin: 0,
		fontSize: '$20',
		lineHeight: '$24',
		color: '#000'
	}
});

const StyledDialogCloseButton = styled(Button, {
	color: '$primary400',
	height: '40px !important',
	padding: '10px !important',

	transition: 'all 0.25s ease-in-out',

	'&:hover': {
		backgroundColor: '$primary50 !important'
	}
});

/**
 * Accordion Animations
 */

const slideDown = keyframes({
	from: { height: 0 },
	to: { height: 'var(--radix-accordion-content-height)' }
});

const slideUp = keyframes({
	from: { height: 'var(--radix-accordion-content-height)' },
	to: { height: 0 }
});

/**
 * Accordion Styles
 */
const StyledAccordionHeader = styled(AccordionPrimitive.Header, {
	all: 'unset',
	display: 'flex'
});

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger, {
	all: 'unset',

	flex: 1,
	display: 'flex',
	alignItems: 'center',
	gap: '$8',

	cursor: 'pointer',

	/**
	 * Rotate icon if is open
	 */
	'&[data-state="open"]': {
		svg: {
			transform: 'rotate(180deg)'
		}
	}
});

const StyledAccordionContent = styled(AccordionPrimitive.Content, {
	paddingTop: '$16',

	overflow: 'hidden',

	'&[data-state="open"]': {
		animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`
	},
	'&[data-state="closed"]': {
		animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`
	}
});

const StyledAccordionIcon = styled(Icon, {
	color: '$primary400',
	size: '$24',
	transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)'
});

const StyledAccordionItem = styled(AccordionPrimitive.Item, {
	overflow: 'hidden'
});

/**
 * Custom styles
 */
const ButtonsContainer = styled(Flex, {
	borderTop: '1px solid $colors$primary100',
	py: '$24',
	px: '$32',
	position: 'fixed',
	width: '100%',
	bottom: 0,
	right: 0,

	'&>button': {
		margin: 0
	}
});

export {
	ButtonsContainer,
	StyledAccordionContent,
	StyledAccordionHeader,
	StyledAccordionIcon,
	StyledAccordionItem,
	StyledAccordionTrigger,
	StyledDialogCloseButton,
	StyledDialogContent,
	StyledDialogOverlay,
	StyledDialogTitle
};
