import { StoryFn } from '@storybook/react';

import UserItem from '@/components/Users/UsersList/UserItem/UserItem';
import { UserWithTeamsFactory } from '@/utils/factories/user';

export default {
  title: 'Users/UserItem',
  component: UserItem,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    userWithTeams: UserWithTeamsFactory.create(),
  },
  argTypes: {
    userWithTeams: {
      type: { required: true },
      description: 'User to be displayed',
      table: {
        type: { summary: 'UserWithTeams' },
      },
    },
  },
};

const Template: StoryFn<typeof UserItem> = ({ userWithTeams }) => (
  <UserItem userWithTeams={userWithTeams} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
