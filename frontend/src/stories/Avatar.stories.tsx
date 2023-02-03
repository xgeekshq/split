import React from 'react';
import { ComponentStory } from '@storybook/react';
import Avatar from '@/components/Primitives/Avatar';

const FLEX_CONTROLS = [
  'align',
  'asChild',
  'direction',
  'gap',
  'justify',
  'media',
  'clickable',
  'pointer',
  'wrap',
];

export default {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css', ...FLEX_CONTROLS],
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: '', // Change main component description in docs page
      },
    },
  },
  args: {
    fallbackText: 'LI',
    size: 32,
  },
  argTypes: {
    fallbackText: {
      control: { type: 'text' },
      description: 'The component fallback text.',
    },
    size: {
      control: { type: 'range', max: 64, min: 16, step: 2 },
      description: 'The component size',
    },
    colors: {
      control: {
        type: 'object',
      },
    },
    isDefaultColor: {
      control: false,
      description: 'Whether the icon uses the default color (#F3FD58) or a random color',
    },
    isBoardPage: {
      control: { type: 'boolean' },
      description: "Whether the icon is located in a board's page",
    },
    id: {
      control: false,
      description: "User's id. Check if the user has a specific color attributed to them.",
    },
  },
};

const Template: ComponentStory<typeof Avatar> = ({ children, ...args }) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
