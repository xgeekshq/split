import React from 'react';
import { ComponentStory } from '@storybook/react';

import AvatarGroup from '@/components/Primitives/AvatarGroup';
import { mockListUsers } from './mocks/avatarGroup_listUsers';

export default {
  title: 'Primitives/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: '', // Change main component description in docs page
      },
    },
  },
  args: {
    listUsers: mockListUsers,
    teamAdmins: false,
    stakeholders: false,
    userId: '63bfe966f36aa91d9bdc08c7',
    haveError: false,
    responsible: false,
    myBoards: false,
    isBoardsPage: false,
  },
};

const Template: ComponentStory<typeof AvatarGroup> = ({ ...args }) => <AvatarGroup {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const AvatarGroupWithList: ComponentStory<typeof AvatarGroup> = ({ ...args }) => (
  <AvatarGroup {...args} />
);

AvatarGroupWithList.args = {
  isBoardsPage: true,
};
AvatarGroupWithList.argTypes = {
  isBoardsPage: {
    control: false,
  },
};
