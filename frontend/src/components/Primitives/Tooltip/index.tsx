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
			<StyledContent color={color} avoidCollisions side="top" align="center">
				{content}
				<StyledArrow color={color} width={16} height={5} />
			</StyledContent>
		</TooltipPrimitive.Root>
	);
};

Tooltip.defaultProps = {
	color: undefined
};

export default Tooltip;
