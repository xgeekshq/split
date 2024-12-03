import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Svg from '@/components/Primitives/Icons/Svg/Svg';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { SvgSizeType } from '@/stories/types/PrimitiveTypes';

const SIZE_OPTIONS: SvgSizeType[] = [12, 16, 18, 20, 24, 32, 40, 48, 100];

export default {
  title: 'Primitives/Icons/Svg',
  component: Svg,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Primitives/Icons/Svg/Svg.tsx\`
        `,
      },
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

const Template: StoryFn<typeof Svg> = ({ size }) => (
  <Flex>
    <Svg size={size}>
      <use href="#user" />
    </Svg>
  </Flex>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
