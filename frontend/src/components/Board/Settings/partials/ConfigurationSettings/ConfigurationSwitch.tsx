import { ReactNode } from 'react';

import Flex from '@/components/Primitives/Flex';
import Switch from '@/components/Primitives/Switch';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';

type Props = {
  title: string;
  text?: string;
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  disabledInfo?: string;
};

const ConfigurationSwitchSettings = ({
  title,
  text,
  isChecked,
  handleCheckedChange,
  children,
  disabled,
  disabledInfo,
}: Props) => (
  <Flex gap={20}>
    {disabledInfo ? (
      <Tooltip content={disabledInfo}>
        <Flex>
          <Switch
            checked={isChecked}
            size="sm"
            onCheckedChange={handleCheckedChange}
            disabled={disabled}
          />
        </Flex>
      </Tooltip>
    ) : (
      <Switch checked={isChecked} size="sm" onCheckedChange={handleCheckedChange} />
    )}
    <Flex direction="column">
      <Text size="md" fontWeight="medium">
        {title}
      </Text>
      {text && (
        <Text color="primary500" size="sm">
          {text}
        </Text>
      )}
      {children}
    </Flex>
  </Flex>
);

export { ConfigurationSwitchSettings };
