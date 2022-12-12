import { ReactNode } from 'react';

import Flex from '@/components/Primitives/Flex';
import { Switch } from '@/components/Primitives/Switch';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import SwitchThumbComponent from './SwitchThumbComponent';

type Props = {
  title: string;
  text: string;
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  color?: string;
  disabled?: boolean;
  styleVariant?: boolean;
};

const ConfigurationSettings = ({
  title,
  text,
  isChecked,
  handleCheckedChange,
  children,
  color,
  disabled,
  styleVariant,
}: Props) => (
  <Flex gap={20}>
    {styleVariant && (
      <Tooltip content="Can't change your own role">
        <Flex>
          <Switch
            checked={isChecked}
            variant="disabled"
            onCheckedChange={handleCheckedChange}
            disabled={disabled}
          >
            <SwitchThumbComponent isChecked={isChecked} iconName="check" color={color} />
          </Switch>
        </Flex>
      </Tooltip>
    )}
    {!styleVariant && (
      <Switch checked={isChecked} variant="sm" onCheckedChange={handleCheckedChange}>
        <SwitchThumbComponent isChecked={isChecked} iconName="check" color={color} />
      </Switch>
    )}
    <Flex direction="column">
      <Text size="md" weight="medium">
        {title}
      </Text>
      <Text color="primary500" size="sm">
        {text}
      </Text>
      {children}
    </Flex>
  </Flex>
);

export { ConfigurationSettings };
