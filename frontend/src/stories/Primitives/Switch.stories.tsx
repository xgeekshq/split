import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Switch from '@/components/Primitives/Switches/Switch/Switch';
import { SwitchSizeType } from '../types/PrimitiveTypes';

const SIZE_OPTIONS: SwitchSizeType[] = ['xs', 'sm', 'md'];

export default {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    controls: {
      exclude: ['asChild', 'defaultChecked', 'icon', 'name', 'required'],
    },
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Switch.tsx\`
        `,
      },
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
      description: 'The controlled checked state of the switch.',
    },
    onCheckedChange: {
      control: false,
      description: 'Event handler called when the checked state of the switch changes.',
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
