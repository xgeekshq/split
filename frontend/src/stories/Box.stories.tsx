import React from 'react';
import { ComponentStory } from '@storybook/react';

import Box from '@/components/Primitives/Box';

export default {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
    },
  },
  argTypes: {
    elevation: {
      options: ['0', '1', '2', '3', '4'],
      control: { type: 'select' },
    },
    variant: {
      options: ['bordered', 'dropdown'],
      control: { type: 'select' },
    },
  },
};

const Template: ComponentStory<typeof Box> = (args) => <Box {...args}>Hello World</Box>;

export const Regular = Template.bind({});
export const Elevation = Template.bind({});
