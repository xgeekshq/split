import { ReactNode } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Switch from '@/components/Primitives/Inputs/Switches/Switch/Switch';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

export type ConfigurationSwitchProps = {
  title: string;
  text?: string;
  fontSize?: 'sm' | 'md';
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  disabled?: boolean;
  disabledInfo?: string;
};

const ConfigurationSwitch = ({
  title,
  text,
  fontSize = 'md',
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
      <Text size={fontSize} fontWeight="medium">
        {title}
      </Text>
      {text && (
        <Text color="primary500" size={fontSize === 'md' ? 'sm' : 'xs'}>
          {text}
        </Text>
      )}
      {children}
    </Flex>
  </Flex>
);

export default ConfigurationSwitch;
