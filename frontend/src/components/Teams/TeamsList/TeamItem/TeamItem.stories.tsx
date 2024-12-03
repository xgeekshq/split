import { useSession } from 'next-auth/react';
import { StoryFn } from '@storybook/react';

import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import { createTeamUser } from '@/stories/utils/createTeamUser';
import { TeamFactory } from '@/utils/factories/team';

export default {
  title: 'Teams/TeamItem',
  component: TeamItem,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    nextRouter: {
      pathname: '/teams',
      query: {},
    },
  },
  args: {
    team: TeamFactory.create(),
  },
  argTypes: {
    team: {
      type: { required: true },
      description: 'Team to be displayed',
      table: {
        type: { summary: 'Team' },
      },
    },
  },
};

const Template: StoryFn<typeof TeamItem> = ({ team }) => {
  const { data: session } = useSession();
  const user: any = session?.user;

  if (user.isMember) {
    createTeamUser(user, team);
  }

  return <TeamItem isSAdmin={user.isSAdmin} team={team} userId={user.id} />;
};

export const Default = Template.bind({});
Default.storyName = 'Team Page';

export const UserPage = Template.bind({});
UserPage.storyName = 'User Page';
UserPage.parameters = {
  nextRouter: {
    pathname: '/users',
    query: {
      userId: '420',
    },
  },
};
