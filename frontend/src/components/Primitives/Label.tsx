import * as LabelPrimitive from '@radix-ui/react-label';

import { styled } from 'styles/stitches/stitches.config';

import Text from './Text';

const Label = styled(LabelPrimitive.Root, Text, {
	display: 'inline-block',
	verticalAlign: 'middle',
	cursor: 'default',
	userSelect: 'none'
});

export default Label;
