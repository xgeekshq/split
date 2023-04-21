import { ComponentStory } from '@storybook/react';

import RoleSelector from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { TeamFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';

export default {
  title: 'Teams/RoleSelector',
  component: RoleSelector,
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    role: TeamUserRoles.ADMIN,
    userId: UserFactory.create()._id,
    teamId: TeamFactory.create().id,
    isTeamPage: false,
    canChangeRole: true,
  },
  argTypes: {
    role: {
      control: { type: 'select' },
      description: 'The team member role.',
    },
    userId: {
      control: false,
      description: 'ID of the user whose role is being changed.',
    },
    teamId: {
      control: false,
      description: 'ID of the team',
    },
    isTeamPage: {
      control: false,
      description: 'If the component is being used in a Team Page',
    },
    canChangeRole: {
      description: 'If the role can be changed',
    },
  },
};

const Template: ComponentStory<typeof RoleSelector> = (args) => <RoleSelector {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
