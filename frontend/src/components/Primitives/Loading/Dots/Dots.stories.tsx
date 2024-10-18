import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Dots from '@/components/Primitives/Loading/Dots/Dots';

export default {
  title: 'Primitives/Loading/Dots',
  component: Dots,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Dots element, it's used for Loading.

        **File Path:**
        \`@/components/Primitives/Loading/Dots/Dots.tsx\` and \`@/components/Primitives/Loading/Dots/styles.tsx\`
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
      control: { type: 'select' },
      description: 'The component color.',
    },
    size: {
      control: { type: 'select' },
      description: 'The component size.',
    },
  },
};

const Template: StoryFn<typeof Dots> = ({ ...args }) => <Dots {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
