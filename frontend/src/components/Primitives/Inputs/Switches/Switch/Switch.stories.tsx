import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Switch from '@/components/Primitives/Inputs/Switches/Switch/Switch';

export default {
  title: 'Primitives/Inputs/Switches/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Inputs/Switches/Switch/Switch.tsx\`
        `,
      },
    },
  },
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      description: 'The component size.',
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
    icon: {
      control: false,
      description: 'The icon displayed on the switch when toggled.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'check' },
      },
    },
  },
};

const Template: ComponentStory<typeof Switch> = ({ size, disabled }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <Switch
      checked={isChecked}
      disabled={disabled}
      size={size}
      onCheckedChange={() => {
        setIsChecked((prevState) => !prevState);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
