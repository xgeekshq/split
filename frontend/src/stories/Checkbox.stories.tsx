import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Checkbox from '@/components/Primitives/Checkbox';
import Flex from '@/components/Primitives/Flex';
import { CheckboxSizeType, CheckboxVariantType } from './types/PrimitiveTypes';

const SIZE_OPTIONS: CheckboxSizeType[] = ['sm', 'md'];
const VARIANT_OPTIONS: CheckboxVariantType[] = ['default', 'error'];

export default {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Checkbox.tsx\`
        `,
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
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The checkbox variants.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The checkbox size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
      },
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
