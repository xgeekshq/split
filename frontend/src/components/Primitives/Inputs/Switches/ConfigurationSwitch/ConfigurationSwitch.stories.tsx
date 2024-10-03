import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';

export default {
  title: 'Primitives/Inputs/Switches/ConfigurationSwitch',
  component: ConfigurationSwitch,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Lorem Ipsum',
    text: 'Lorem Ipsum',
    disabled: false,
  },
  argTypes: {
    title: {
      description: 'The title of the switch',
    },
    text: {
      description: 'The text content of the switch',
    },
    size: {
      control: { type: 'select' },
      description: 'The component size.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch.',
    },
    isChecked: {
      control: false,
      description: 'The controlled checked state of the switch.',
    },
    handleCheckedChange: {
      control: false,
      description: 'Event handler called when the checked state of the switch changes.',
    },
    children: {
      control: false,
    },
    disabledInfo: {
      control: 'text',
      description: 'Text content of the tooltip that appears when the switch is disabled.',
    },
  },
};

const Template: StoryFn<typeof ConfigurationSwitch> = (props) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <ConfigurationSwitch
      {...props}
      isChecked={isChecked}
      handleCheckedChange={() => {
        setIsChecked((prevState) => !prevState);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
