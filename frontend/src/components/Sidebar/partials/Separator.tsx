import { ComponentProps } from 'react';

import { styled } from '@/styles/stitches/stitches.config';

const StyledSeparator = styled('div', { height: '1px', backgroundColor: '$primary600' });

type SeparatorProps = ComponentProps<typeof StyledSeparator>;

const Separator: React.FC<SeparatorProps> = (props) => <StyledSeparator {...props} />;
export default Separator;
