import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';

export default {
  title: 'Primitives/Inputs/SearchInput',
  component: SearchInput,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Specifies an input field where the user can enter data. Used to filter lists, tables, etc.

        **File Path:**
        \`@/components/Primitives/Inputs/SearchInput/SearchInput.tsx\` and \`@/components/Primitives/Input/styles.tsx\` 
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
  },
};

const Template: ComponentStory<typeof SearchInput> = ({ ...args }) => <SearchInput {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
