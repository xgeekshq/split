import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';

export default {
  title: 'Primitives/Avatar/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: dedent`
        An image element with a fallback for representing the user.

        **File Path:**
        \`@/components/Primitives/Avatar/Avatar.tsx\`
        `,
      },
    },
  },
  args: {
    fallbackText: 'LI',
    size: 32,
    isBoardPage: false,
  },
  argTypes: {
    fallbackText: {
      control: { type: 'text' },
      description:
        "An element that renders when the image hasn't loaded. This means whilst it's loading, or if there was an error.",
    },
    size: {
      control: { type: 'range', max: 64, min: 16, step: 2 },
      description: 'The size of the component.',
    },
    colors: {
      control: {
        type: 'object',
      },
      description:
        'Color scheme of the component. It has a background color, font color and whether it has a border or not.',
    },
    isDefaultColor: {
      control: false,
      description: 'Whether the icon uses the default color `#F3FD58` or a random color.',
    },
    isBoardPage: {
      control: { type: 'boolean' },
      description: "Whether the icon is located in a board's page.",
    },
    id: {
      control: false,
      description: "User's id. Check if the user has a specific color attributed to them.",
    },
    src: {
      description: '*Unused*. Future proof for when user avatars are used in SPLIT.',
    },
  },
};

const Template: ComponentStory<typeof Avatar> = ({ children, ...args }) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
