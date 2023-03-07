import { ComponentStory } from '@storybook/react';

import TeamMemberItem from '@/components/Teams/Team/TeamMemberItem';
import { TeamUserFactory } from '@/utils/factories/user';

export default {
  title: 'Teams/TeamMemberItem',
  component: TeamMemberItem,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    isTeamPage: false,
    member: TeamUserFactory.create(),
    hasPermissions: false,
  },
  argTypes: {
    isTeamPage: {
      description: 'If the component is being used in a Team Page',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    member: {
      type: { required: true },
      description: 'Team member to be displayed',
      table: {
        type: { summary: 'TeamUser' },
      },
    },
    hasPermissions: {
      description: 'If the user has permissions to edit the Team Member',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

const Template: ComponentStory<typeof TeamMemberItem> = (args) => <TeamMemberItem {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
