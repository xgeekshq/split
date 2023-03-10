import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
} from '@/components/Primitives/Inputs/Select/Select';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

const DUMMY_OPTIONS = [
  {
    label: 'Apple',
    value: 'Apple',
  },
  {
    label: 'Banana',
    value: 'Banana',
  },
  {
    label: 'Blueberry',
    value: 'Blueberry',
  },
  {
    label: 'Grapes',
    value: 'Grapes',
  },
  {
    label: 'Pineapple',
    value: 'Pineapple',
  },
];

export default {
  title: 'Primitives/Inputs/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Displays a list of options for the user to pick from.

        **File Path:**
        \`@/components/Primitives/Inputs/Select/Select.tsx\`
        `,
      },
    },
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the select.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    hasError: {
      control: { type: 'boolean' },
      description: 'Whether the select has an error.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    onValueChange: {
      description: 'Event handler called when an option is selected.',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    defaultValue: {
      description: 'Initial value of the select.',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description:
        'Placeholder text that will appear when no option has been selected. This is passed to `SelectValue`',
      table: {
        type: { summary: 'string' },
      },
    },
    options: {
      description:
        'Options array from where the user is able to choose from. This is passed to `SelectContent`.',
      table: {
        type: { summary: '{ label: string, value: string | number }[]' },
      },
    },
  },
};

const Template: ComponentStory<typeof Select> = ({ disabled, hasError }) => {
  const [selectedOption, setSelectedOption] = useState<String | null>();

  return (
    <Flex>
      <Select
        disabled={disabled}
        hasError={hasError}
        css={{ width: '$300' }}
        defaultValue={selectedOption}
        onValueChange={(newSelectedOption: string) => {
          setSelectedOption(newSelectedOption);
        }}
      >
        <SelectTrigger css={{ padding: '$16' }}>
          <Flex direction="column">
            <SelectValue placeholder="Choose a fruit" />
          </Flex>
          <SelectIcon className="SelectIcon">
            <Icon name="arrow-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent options={DUMMY_OPTIONS} />
      </Select>
    </Flex>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const WithLabel: ComponentStory<typeof Select> = ({ disabled, hasError }) => {
  const [selectedItem, setSelectedItem] = useState<String | null>();

  return (
    <Flex>
      <Select
        disabled={disabled}
        hasError={hasError}
        css={{ width: '$300', height: '$64' }}
        defaultValue={selectedItem}
        onValueChange={(selectedOption: string) => {
          setSelectedItem(selectedOption);
        }}
      >
        <SelectTrigger css={{ padding: '$24' }}>
          <Flex direction="column">
            <Text size={selectedItem ? 'sm' : 'md'} color="primary300">
              Choose a fruit
            </Text>
            <SelectValue />
          </Flex>
          <SelectIcon className="SelectIcon">
            <Icon name="arrow-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent options={DUMMY_OPTIONS} />
      </Select>
    </Flex>
  );
};
