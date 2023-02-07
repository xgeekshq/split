import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import Switch from '@/components/Primitives/Switch';
import { SwitchSizeType } from './types/PrimitiveTypes';

const SIZE_OPTIONS: SwitchSizeType[] = ['xs', 'sm', 'md'];

export default {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css', 'asChild', 'defaultChecked', 'icon', 'name', 'required'],
      sort: 'requiredFirst',
    },
  },
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the switch.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    checked: {
      control: false,
      description: "Switch's state variable.",
    },
    onCheckedChange: {
      control: false,
      description: 'Executes every time the switch changes state.',
    },
  },
};

const Template: ComponentStory<typeof Switch> = ({ size, disabled }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <Switch
      size={size}
      disabled={disabled}
      checked={isChecked}
      onCheckedChange={() => {
        setIsChecked((prevState) => !prevState);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
