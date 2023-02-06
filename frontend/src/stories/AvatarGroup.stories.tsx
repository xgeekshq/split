import React from 'react';
import { ComponentStory } from '@storybook/react';

import AvatarGroup from '@/components/Primitives/Avatar/AvatarGroup';
import { mockListUsers } from './mocks/avatarGroup_listUsers';

export default {
  title: 'Primitives/Avatar/AvatarGroup',
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
  argTypes: {
    listUsers: {
      control: { type: 'object' },
      description: 'List of users in a Board.',
      table: {
        type: {
          summary: '{ user: User | string, role: TeamUserRoles | BoardUserRoles, _id: string }',
        },
      },
    },
    teamAdmins: {
      control: { type: 'boolean' },
      description: 'Shows only the Team Admins. Only works for SPLIT Boards.',
      table: {
        type: {
          summary: 'boolean',
        },
        category: 'filter',
      },
    },
    stakeholders: {
      control: { type: 'boolean' },
      description: 'Shows only the Stakeholders. Only works for SPLIT Boards.',
      table: {
        type: {
          summary: 'boolean',
        },
        category: 'filter',
      },
    },
    userId: {
      control: { type: 'text' },
      description: 'Logged in User ID.',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    haveError: {
      control: { type: 'boolean' },
      description: 'Displays an Error Avatar Group.',
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
    responsible: {
      control: { type: 'boolean' },
      description: 'Shows only the Responsibles. Only works for Regular Boards.',
      table: {
        type: {
          summary: 'boolean',
        },
        category: 'filter',
      },
    },
    myBoards: {
      control: { type: 'boolean' },
      description: 'Displays Logged in User Avatar.',
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
    isBoardsPage: {
      control: { type: 'boolean' },
      description: 'Used to allow the Avatar Group to have a Drawer with all the Users',
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
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
