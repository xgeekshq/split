import { styled } from '@stitches/react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { CSSProps } from '@/styles/stitches/stitches.config';

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
    css={css}
    data-testid="alertBox"
    elevation="1"
    gap="24"
    justify="between"
    type={type}
  >
    <Flex align="center" gap="24">
      <Icon name={`blob-${type}`} size={32} />
      <Flex align="start" direction="column" gap="4">
        {!!title && <Text heading="5">{title}</Text>}

        {!!text && <Text size="sm">{text}</Text>}
      </Flex>
    </Flex>
    {children}
  </AlertStyle>
);

export default AlertBox;
