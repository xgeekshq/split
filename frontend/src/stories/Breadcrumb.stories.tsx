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
        Dots element, it's used for Loading.

        **File Path:**
        \`@/components/Primitives/Loading/Dots/index.tsx\` and \`@/components/Primitives/Loading/Dots/styles.tsx\`
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
};

const Template: ComponentStory<typeof Breadcrumb> = ({ ...args }) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
