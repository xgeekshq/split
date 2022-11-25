import { FC } from 'react';

import { CSSProps } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Flex from '../Flex';
import Text from '../Text';
import { AlertIconStyle, AlertStyle, AlertText } from './styles';

type AlertBoxProps = CSSProps & {
  type: 'warning' | 'info' | 'error';
  title?: string;
  text?: string;
};

const AlertBox: FC<AlertBoxProps> = ({ type, title, text, children, css }) => (
  <AlertStyle align="center" css={css} justify="between" type={type}>
    <Flex align="center">
      <AlertIconStyle>
        <Icon name={['warning', 'error'].includes(type) ? 'blob-error' : 'blob-info'} />
      </AlertIconStyle>
      <AlertText direction="column">
        {!!title && <Text heading="5">{title}</Text>}

        {!!text && <Text size="sm">{text}</Text>}
      </AlertText>
    </Flex>
    {children}
  </AlertStyle>
);

AlertBox.defaultProps = { title: undefined, text: undefined };

export default AlertBox;
