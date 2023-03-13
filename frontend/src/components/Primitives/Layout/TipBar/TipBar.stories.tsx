import React from 'react';
import { ComponentStory } from '@storybook/react';

import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import dedent from 'ts-dedent';

export default {
  title: 'Primitives/Layout/TipBar',
  component: TipBar,
  parameters: {
    docs: {
      description: {
        component: dedent`
        TipBar used to display Tips in pages where you create someting (Teams or Boards).

        **File Path:**
        \`@/components/Primitives/Layout/TipBar.tsx\`
        `,
      },
    },
  },
  args: {
    iconName: 'blob-idea',
    tips: [
      {
        title: 'Lorem Ipsum',
        description: [
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad porro similique perspiciatis tempora.',
          'Libero animi quis dolores vitae maiores similique quam velit. Sapiente quas ipsam blanditiis ratione, corporis laborum in?',
        ],
      },
      {
        title: 'Lorem Ipsum',
        description: [
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad porro similique perspiciatis tempora.',
          'Libero animi quis dolores vitae maiores similique quam velit. Sapiente quas ipsam blanditiis ratione, corporis laborum in?',
        ],
      },
    ],
  },
  argTypes: {
    iconName: {
      control: { type: 'select' },
      description: 'Defines the icon that is displayed before the tips.',
    },
    tips: {
      description: 'Array of tips to show. Each tip contains a title and an array of descriptions.',
      table: {
        type: { summary: 'Tip[ title: string, description: string[] ]' },
      },
    },
  },
};

const Template: ComponentStory<typeof TipBar> = ({ ...args }) => <TipBar {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
