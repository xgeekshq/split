import React from 'react';
import { ComponentStory } from '@storybook/react';

import Svg from '@/components/Primitives/Svg';
import Flex from '@/components/Primitives/Flex';
import { SvgSizeType } from './types/PrimitiveTypes';

const SIZE_OPTIONS: SvgSizeType[] = [12, 16, 18, 20, 24, 32];

export default {
  title: 'Primitives/Svg',
  component: Svg,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
  },
  args: {
    size: 32,
  },
  argTypes: {
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
      },
    },
  },
};

const Template: ComponentStory<typeof Svg> = ({ size, ...args }) => (
  <Flex>
    <Svg size={size} {...args}>
      <use href="#user" />
    </Svg>
  </Flex>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
