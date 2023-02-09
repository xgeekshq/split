import React from 'react';
import { ComponentStory } from '@storybook/react';

import Tab from '@/components/Primitives/Tab';
import Flex from '@/components/Primitives/Flex';

export default {
  title: 'Primitives/Tab',
  component: Tab,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css', 'asChild'],
      sort: 'requiredFirst',
    },
  },
  args: {
    tabList: [
      {
        value: 'participants',
        label: 'Participants',
        content: <Flex>Participants Tab Content</Flex>,
      },
      {
        value: 'config',
        label: 'Configurations',
        content: <Flex>Config Tab Content</Flex>,
      },
    ],
    defaultValue: 'config',
  },
  argTypes: {
    activeValue: {
      control: { type: 'string' },
      description: 'Used to Control the active Tab',
      table: {
        type: { summary: 'string' },
      },
    },
    onChangeActiveValue: {
      description: 'Function used to set the new active Tab',
      table: {
        type: { summary: '(newTab: string) => void' },
      },
    },
  },
};

const Template: ComponentStory<typeof Tab> = ({ ...args }) => <Tab {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
