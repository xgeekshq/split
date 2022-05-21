import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import {
	slideDownAndFade,
	slideLeftAndFade,
	slideRightAndFade,
	slideUpAndFade
} from '../../animations/Slide';
import { styled } from '../../stitches.config';

const StyledContent = styled(HoverCardPrimitive.Content, {
	borderRadius: 6,
	padding: 20,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: 'fit-content',
	backgroundColor: 'white',
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	'@motion': {
		animationDuration: '400ms',
		animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
		willChange: 'transform, opacity',
		'&[data-state="open"]': {
			'&[data-side="top"]': { animationName: slideDownAndFade },
			'&[data-side="right"]': { animationName: slideLeftAndFade },
			'&[data-side="bottom"]': { animationName: slideUpAndFade },
			'&[data-side="left"]': { animationName: slideRightAndFade }
		}
	}
});

const StyledArrow = styled(HoverCardPrimitive.Arrow, {
	fill: 'white'
});

const StyledCardRoot = styled(HoverCardPrimitive.Root);
const StyledCardTrigger = styled(HoverCardPrimitive.Trigger);

export const HoverCardRoot = StyledCardRoot;
export const HoverCardTrigger = StyledCardTrigger;
export const HoverCardContent = StyledContent;
export const HoverCardArrow = StyledArrow;
