import { CSSProps } from '@/styles/stitches/stitches.config';
import { styled } from '@stitches/react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Box from '@/components/Primitives/Layout/Box/Box';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

const AlertStyle = styled(Flex, Box, {
  padding: '$16 $40',
  border: '1px solid',
  borderRadius: '$12',
  variants: {
    type: {
      success: {
        backgroundColor: '$successLightest',
        borderColor: '$colors$successBase',
      },
      warning: {
        backgroundColor: '$warningLightest',
        borderColor: '$colors$warningBase',
      },
      error: {
        backgroundColor: '$dangerLightest',
        borderColor: '$colors$dangerBase',
      },
      info: {
        backgroundColor: '$infoLightest',
        borderColor: '$colors$infoBase',
      },
    },
  },
});

export type AlertBoxProps = CSSProps & {
  type: 'success' | 'warning' | 'info' | 'error';
  children?: React.ReactNode;
  title?: string;
  text?: string;
};

const AlertBox = ({ type, title, text, children, css }: AlertBoxProps) => (
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
