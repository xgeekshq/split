import React from 'react';
import { ComponentStory } from '@storybook/react';

import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import dedent from 'ts-dedent';
import { SpinnerSizeType } from '../../../../stories/types/PrimitiveTypes';

const SIZE_OPTIONS: SpinnerSizeType[] = [50, 80, 100, 150, 200];

export default {
  title: 'Primitives/Loading/Page',
  component: LoadingPage,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Loading Page, used when a page is loading.

        **File Path:**
        \`@/components/Primitives/Loading/Page/Page.tsx\`
        `,
      },
    },
  },
  args: {
    size: 100,
  },
  argTypes: {
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The loading spinner size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 100 },
      },
    },
  },
};

const Template: ComponentStory<typeof LoadingPage> = ({ ...args }) => <LoadingPage {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
