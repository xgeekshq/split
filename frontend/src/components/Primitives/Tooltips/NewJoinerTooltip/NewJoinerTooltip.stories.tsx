import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import NewJoinerTooltip from '@/components/Primitives/Tooltips/NewJoinerTooltip/NewJoinerTooltip';

export default {
  title: 'Primitives/Tooltips/NewJoinerTooltip',
  component: NewJoinerTooltip,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A popup that displays information related to the New Joiner status of a team member.

        **File Path:**
        \`@/components/Primitives/Tooltips/NewJoinerTooltip/NewJoinerTooltip.jsx\` and \`@/components/Primitives/NewJoinerTooltip/NewJoinerTooltip/styles.jsx\`
        `,
      },
    },
  },
};

const Template: ComponentStory<typeof NewJoinerTooltip> = () => <NewJoinerTooltip />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
