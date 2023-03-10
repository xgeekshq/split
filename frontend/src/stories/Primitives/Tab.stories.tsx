import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Tab from '@/components/Primitives/Tab/Tab';
import Flex from '@/components/Primitives/Layout/Flex';

export default {
  title: 'Primitives/Tab',
  component: Tab,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A set of layered sections of content, also known as tab panels, that are displayed one at a time.

        **File Path:**
        \`@/components/Primitives/Tab.tsx\`
        `,
      },
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
      description: 'The controlled value of the tab to activate.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChangeActiveValue: {
      description: 'Event handler called when the value changes.',
      table: {
        type: { summary: '(newTab: string) => void' },
      },
    },
    tabList: {
      description: 'List of the tabs that will be displayed.',
      table: {
        type: { summary: '{ value: string, label: string, content: ReactNode }[]' },
      },
    },
    defaultValue: {
      control: false,
    },
  },
};

const Template: ComponentStory<typeof Tab> = ({ ...args }) => <Tab {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
