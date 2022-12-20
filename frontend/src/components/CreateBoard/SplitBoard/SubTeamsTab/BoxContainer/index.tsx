import { ReactNode } from 'react';
import { StyledBox } from './styles';

type BoxContainerProps = {
  children: ReactNode;
  color: string;
};

const BoxContainer = ({ children, color }: BoxContainerProps) => (
  <StyledBox direction="column" elevation="1" gap="2" css={{ background: color }}>
    {children}
  </StyledBox>
);

export default BoxContainer;
