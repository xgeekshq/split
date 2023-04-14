import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { UserList } from '@/types/team/userList';
import { UserListFactory } from '@/utils/factories/user';
import UserCheckbox from './UserCheckbox';

export default {
  title: 'Primitives/Inputs/Checkboxes/UserCheckbox',
  component: UserCheckbox,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A control that allows the user to toggle between checked and not checked.

        **File Path:**
        \`@/components/Primitives/Inputs/Checkboxes/UserCheckbox/UserCheckbox.tsx\``,
      },
    },
  },
  args: {
    disabled: false,
  },
  argTypes: {
    user: {
      control: false,
      description: 'The user who the checkbox is about.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the checkbox.',
    },
    handleChecked: {
      control: false,
      description: 'Event handler called when the checked state of the checkbox changes.',
    },
  },
};

const Template: ComponentStory<typeof UserCheckbox> = ({ disabled }) => {
  const [user, setUser] = useState<UserList>(UserListFactory.create());

  return (
    <Flex>
      <UserCheckbox
        disabled={disabled}
        user={user}
        handleChecked={() => {
          setUser((prev) => ({ ...prev, isChecked: !prev.isChecked }));
        }}
      />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
