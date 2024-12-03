import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import TeamRolePopover from '@/components/Primitives/Popovers/TeamRolePopover/TeamRolePopover';

export default {
  title: 'Primitives/Popovers/TeamRolePopover',
  component: TeamRolePopover,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Popover used to control the role of a team member.

        **File Path:**
        \`@/components/Primitives/Popovers/TeamRolePopover/TeamRolePopover.tsx\`
        `,
      },
    },
  },
  args: {},
  argTypes: {
    handleRoleChange: {
      control: false,
      description: 'Event handler called when a different role is selected.',
    },
  },
};

const Template: StoryFn<typeof TeamRolePopover> = () => (
  <TeamRolePopover handleRoleChange={() => {}} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
