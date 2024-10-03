import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';

export default {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Breadcrumbs allow users to navigate back to previous linked pages.

        **File Path:**
        \`@/components/Primitives/Breadcrumb/Breadcrumb.tsx\``,
      },
    },
  },
  args: {
    items: [
      {
        title: 'Boards',
        link: '/boards',
      },
      {
        title: 'SPLIT Board',
        link: '/boards/63e1220167de04688a875a84',
      },
      {
        title: 'Sub-team Board 1',
        isActive: true,
      },
    ],
  },
  argTypes: {
    items: {
      control: { type: 'array' },
      description: 'List of previous pages that are linked.',
      table: {
        type: {
          summary: '{ items: [ title: string, link?: string, isActive?: boolean ] }',
        },
      },
    },
  },
};

const Template: StoryFn<typeof Breadcrumb> = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
