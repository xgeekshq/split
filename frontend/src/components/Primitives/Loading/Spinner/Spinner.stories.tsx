import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Spinner from '@/components/Primitives/Loading/Spinner/Spinner';
import { SpinnerColorType, SpinnerSizeType } from '@/stories/types/PrimitiveTypes';

const COLOR_OPTIONS: SpinnerColorType[] = ['light', 'dark'];
const SIZE_OPTIONS: SpinnerSizeType[] = [50, 80, 100, 150, 200];

export default {
  title: 'Primitives/Loading/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Spinner element, it spins forever.

        **File Path:**
        \`@/components/Primitives/Loading/Spinner/Spinner.tsx\`
        `,
      },
    },
  },
  args: {
    size: 80,
    color: 'dark',
  },
  argTypes: {
    color: {
      options: COLOR_OPTIONS,
      control: { type: 'select' },
      description: 'The component color.',
      table: {
        type: { summary: COLOR_OPTIONS.join('|') },
        defaultValue: { summary: 'dark' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 80 },
      },
    },
  },
};

const Template: ComponentStory<typeof Spinner> = ({ ...args }) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
