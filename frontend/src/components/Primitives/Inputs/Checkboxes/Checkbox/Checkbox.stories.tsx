import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export default {
  title: 'Primitives/Inputs/Checkboxes/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox.tsx\``,
      },
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    label: 'Click me',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      description: 'The checkbox variants.',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      description: 'The checkbox size.',
    },
    id: {
      control: false,
      description: "Checkbox's id. Identifies the checkbox in the form.",
    },
    label: {
      control: { type: 'text' },
      description: 'The text that follows the checkbox.',
    },
    checked: {
      control: false,
      description: 'The controlled checked state of the checkbox.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the checkbox.',
    },
    handleChange: {
      description: 'Event handler called when the checked state of the checkbox changes.',
    },
  },
};

const Template: ComponentStory<typeof Checkbox> = ({ size, variant, label, disabled }) => {
  const [state, setState] = useState<boolean>(false);

  return (
    <Flex>
      <Checkbox
        id="myCheckbox"
        label={label}
        size={size}
        variant={variant}
        checked={state}
        handleChange={(checked) => {
          setState(checked);
        }}
        disabled={disabled}
      />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
