import React from 'react';
import { ComponentStory } from '@storybook/react';

import Dots from '@/components/Primitives/Loading/Dots';
import dedent from 'ts-dedent';
import { DotsColorType, DotsSizeType } from './types/PrimitiveTypes';

const COLOR_OPTIONS: DotsColorType[] = ['primary800', 'primary200', 'white'];
const SIZE_OPTIONS: DotsSizeType[] = [8, 4, 10, 15, 50, 80, 100];

export default {
  title: 'Primitives/Loading/Dots',
  component: Dots,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Dots element, it's used for Loading.

        **File Path:**
        \`@/components/Primitives/Loading/Dots/index.tsx\` and \`@/components/Primitives/Loading/Dots/styles.tsx\`
        `,
      },
    },
  },
  args: {
    size: 15,
    color: 'primary800',
  },
  argTypes: {
    color: {
      options: COLOR_OPTIONS,
      control: { type: 'select' },
      description: 'The component color.',
      table: {
        type: { summary: COLOR_OPTIONS.join('|') },
        defaultValue: { summary: 'primary800' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 15 },
      },
    },
  },
};

const Template: ComponentStory<typeof Dots> = ({ ...args }) => <Dots {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
