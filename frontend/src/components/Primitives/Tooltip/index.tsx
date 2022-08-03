import React, { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { StyledArrow, StyledContent } from './styles';

type Props = {
	content: ReactNode;
	children: ReactNode;
	color?: 'primary800' | 'primary700' | 'primary600' | 'primary500' | 'primary100';
};

const Tooltip = ({ children, content, color }: Props) => {
	return (
		<TooltipPrimitive.Root delayDuration={200}>
			<TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
			<StyledContent avoidCollisions align="center" color={color} side="top">
				{content}
				<StyledArrow color={color} height={5} width={16} />
			</StyledContent>
		</TooltipPrimitive.Root>
	);
};

Tooltip.defaultProps = {
	color: undefined
};

export default Tooltip;
