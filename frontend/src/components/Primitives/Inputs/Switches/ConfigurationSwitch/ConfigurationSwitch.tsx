import { ReactNode } from 'react';

import Switch from '@/components/Primitives/Inputs/Switches/Switch/Switch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

export type ConfigurationSwitchProps = {
  title: string;
  text?: string;
  size?: 'sm' | 'md';
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  disabledInfo?: string;
};

const ConfigurationSwitch = ({
  title,
  text,
  size = 'md',
  isChecked,
  handleCheckedChange,
  children,
  disabled = false,
  disabledInfo,
}: ConfigurationSwitchProps) => (
  <Flex data-testid="configurationSwitch" gap={20}>
    {disabledInfo && disabled ? (
      <Tooltip content={disabledInfo}>
        <Flex>
          <Switch
            checked={isChecked}
            disabled={disabled}
            onCheckedChange={handleCheckedChange}
            size="sm"
          />
        </Flex>
      </Tooltip>
    ) : (
      <Switch
        checked={isChecked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        size={size}
      />
    )}
    <Flex direction="column">
      <Text fontWeight="medium" size={size}>
        {title}
      </Text>
      {text && (
        <Text color="primary500" size={size === 'md' ? 'sm' : 'xs'}>
          {text}
        </Text>
      )}
      {children}
    </Flex>
  </Flex>
);

export default ConfigurationSwitch;
