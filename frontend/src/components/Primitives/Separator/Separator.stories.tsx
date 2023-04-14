import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import { SeparatorOrientationType, SeparatorSizeType } from '@/stories/types/PrimitiveTypes';

const ORIENTATION_OPTIONS: SeparatorOrientationType[] = ['horizontal', 'vertical'];

const SIZE_OPTIONS: SeparatorSizeType[] = ['sm', 'md', 'lg', 'full'];

export default {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Visually or semantically separates content.

        **File Path:**
        \`@/components/Primitives/Separator/Separator.tsx\`
        `,
      },
    },
  },
  args: {
    orientation: 'horizontal',
    size: 'full',
  },
  argTypes: {
    orientation: {
      options: ORIENTATION_OPTIONS,
      control: { type: 'select' },
      description: 'The component orientation.',
      table: {
        type: { summary: ORIENTATION_OPTIONS.join('|') },
        defaultValue: { summary: 'horizontal' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 'full' },
      },
    },
  },
};

const Template: ComponentStory<typeof Separator> = ({ ...args }) => (
  <Flex align="center" css={{ height: '100vh', width: '100vh' }} justify="center">
    <Separator {...args} />
  </Flex>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
