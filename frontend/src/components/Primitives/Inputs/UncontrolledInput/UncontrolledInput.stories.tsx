import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import UncontrolledInput from '@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput';

const CURSOR_OPTIONS = ['default', 'Pointer', 'text'];

export default {
  title: 'Primitives/Inputs/UncontrolledInput',
  component: UncontrolledInput,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Allows a customizable input field for users to display data and filter through lists or tables. 

        **File Path:**
        \`@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput.tsx\` 
        `,
      },
    },
  },
  args: {
    disabled: false,
    placeholder: 'Input Text Box',
    currentValue: 'Lorem',
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the input.',
      table: {
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },

    placeholder: {
      description: 'Placeholder text that will appear when the input is empty.',
    },
    currentValue: {
      description: 'Current value of the input.',
    },
    handleChange: {
      control: false,
      description: "Event handler called when the input's current value changes.",
    },
    handleClear: {
      control: false,
      description: 'Event handler called when the clear button is pressed.',
    },
    cursorType: {
      options: CURSOR_OPTIONS,
      control: { type: 'select' },
      description: 'The cursor options examples',
      table: {
        type: { summary: CURSOR_OPTIONS.join('|') },
      },
    },
  },
};

const Template: ComponentStory<typeof UncontrolledInput> = ({ ...args }) => (
  <UncontrolledInput {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
