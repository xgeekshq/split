import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import BoardRolePopover from '@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover';

export default {
  title: 'Primitives/Popovers/BoardRolePopover',
  component: BoardRolePopover,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Popover used to control the New Joiner and Responsible Allowed status of a board member.

        **File Path:**
        \`@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover.tsx\`
        `,
      },
    },
  },
  args: {},
  argTypes: {
    isNewJoiner: {
      control: false,
      description: 'State of the New Joiner status.',
    },
    isNewJoinerHandler: {
      control: false,
      description: 'Event handler called when the New Joiner status value changes.',
    },
    canBeResponsible: {
      control: false,
      description: 'State of the Responsible Allowed status.',
    },
    canBeResponsibleHandler: {
      control: false,
      description: 'Event handler called when the Responsible Allowed status value changes.',
    },
  },
};

const Template: ComponentStory<typeof BoardRolePopover> = () => {
  const [isNewJoiner, setIsNewJoiner] = useState(false);
  const [canBeResponsible, setCanBeResponsible] = useState(false);

  return (
    <BoardRolePopover
      isNewJoiner={isNewJoiner}
      isNewJoinerHandler={() => setIsNewJoiner((prev) => !prev)}
      canBeResponsible={canBeResponsible}
      canBeResponsibleHandler={() => setCanBeResponsible((prev) => !prev)}
    />
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
