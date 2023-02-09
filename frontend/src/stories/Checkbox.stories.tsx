import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import Checkbox from '@/components/Primitives/Checkbox';
import Flex from '@/components/Primitives/Flex';
import { CheckboxSizeType, CheckboxVariantType } from './types/PrimitiveTypes';

const SIZE_OPTIONS: CheckboxSizeType[] = ['sm', 'md'];
const VARIANT_OPTIONS: CheckboxVariantType[] = ['default', 'error'];

export default {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
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
        id="myTextBox"
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
