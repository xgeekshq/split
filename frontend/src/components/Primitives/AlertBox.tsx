import { CSSProps } from '@/styles/stitches/stitches.config';
import { styled } from '@stitches/react';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Box from '@/components/Primitives/Box';
import Icon from '@/components/Primitives/Icon';

const AlertStyle = styled(Flex, Box, {
  padding: '16px 40px',
  border: '1px solid',
  borderRadius: '$12',
  variants: {
    type: {
      warning: {
        backgroundColor: '$warningLightest',
        border: '1px solid $colors$warningBase',
      },
      error: {
        backgroundColor: '$dangerLightest',
        border: '1px solid $colors$highlight4Base',
      },
      info: {
        backgroundColor: '$infoLightest',
        border: '1px solid $colors$infoBase',
      },
    },
  },
});

export type AlertBoxProps = CSSProps & {
  type: 'warning' | 'info' | 'error';
  children?: React.ReactNode;
  title?: string;
  text?: string;
};

const AlertBox = ({ type, title = undefined, text = undefined, children, css }: AlertBoxProps) => (
  <AlertStyle
    align="center"
    justify="between"
    type={type}
    elevation="1"
    gap="24"
    css={css}
    data-testid="alertBox"
  >
    <Flex align="center" gap="24">
      <Icon size={32} name={`blob-${type}`} />
      <Flex direction="column" align="start" gap="4">
        {!!title && <Text heading="5">{title}</Text>}

        {!!text && <Text size="sm">{text}</Text>}
      </Flex>
    </Flex>
    {children}
  </AlertStyle>
);

export default AlertBox;
