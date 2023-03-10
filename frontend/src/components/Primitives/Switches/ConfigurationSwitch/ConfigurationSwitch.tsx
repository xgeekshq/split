import { ReactNode } from 'react';

import Flex from '@/components/Primitives/Layout/Flex';
import Switch from '@/components/Primitives/Switches/Switch/Switch';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip/Tooltip';

type ConfigurationSwitchProps = {
  title: string;
  text?: string;
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  disabledInfo?: string;
};

const ConfigurationSwitch = ({
  title,
  text,
  isChecked,
  handleCheckedChange,
  children,
  disabled,
  disabledInfo,
}: ConfigurationSwitchProps) => (
  <Flex align="center" gap={20} data-testid="configurationSwitch">
    {disabledInfo && disabled ? (
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
      <Switch
        checked={isChecked}
        size="sm"
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      />
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

export default ConfigurationSwitch;
