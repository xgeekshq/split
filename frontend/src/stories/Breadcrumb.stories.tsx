import React from 'react';
import { ComponentStory } from '@storybook/react';

import Breadcrumb from '@/components/Primitives/Breadcrumb';
import dedent from 'ts-dedent';

export default {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Breadcrumbs allow users to navigate back to previous linked pages.

        **File Path:**
        \`@/components/Primitives/Breadcrumb/index.tsx\` and \`@/components/Primitives/Breadcrumb/styles.tsx\`
        `,
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

const Template: ComponentStory<typeof Breadcrumb> = ({ ...args }) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
