import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
} from '@/components/Primitives/Select';
import Sprite from '@/components/icons/Sprite';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';

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
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'Notes: The Select component also accepts other props, such as an onValueChange function and a defaultValue. For more information check the Radix UI documentation under Select.Root.', // Change main component description in docs page
      },
    },
  },
  args: {},
};

const Template: ComponentStory<typeof Select> = ({ disabled, hasError }) => (
  <Flex>
    <Sprite />
    <Select disabled={disabled} hasError={hasError} css={{ width: '$300' }}>
      <SelectTrigger css={{ padding: '$16' }}>
        <Flex direction="column">
          <SelectValue placeholder="Choose a fruit" />
        </Flex>
        <SelectIcon className="SelectIcon" asChild>
          <Icon name="arrow-down" />
        </SelectIcon>
      </SelectTrigger>
      <SelectContent options={DUMMY_OPTIONS} />
    </Select>
  </Flex>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const WithLabel: ComponentStory<typeof Select> = ({ disabled, hasError }) => {
  const [selectedItem, setSelectedItem] = useState<String | null>();

  return (
    <Flex>
      <Sprite />
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
          <SelectIcon className="SelectIcon" asChild>
            <Icon name="arrow-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent options={DUMMY_OPTIONS} />
      </Select>
    </Flex>
  );
};
