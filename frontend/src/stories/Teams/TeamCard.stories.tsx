import { ComponentStory } from '@storybook/react';

import TeamItem from '@/components/Teams/TeamsList/TeamItem';
import { TeamFactory } from '@/utils/factories/team';
import { useSession } from 'next-auth/react';
import { createTeamUser } from '../utils/createTeamUser';

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
  },
  args: {
    team: TeamFactory.create(),
    isTeamPage: false,
  },
};

const Template: ComponentStory<typeof TeamItem> = ({ team, isTeamPage }) => {
  const { data: session } = useSession();
  const user: any = session?.user!;

  if (user.isMember) {
    createTeamUser(user, team);
  }

  return <TeamItem userId={user.id} team={team} isTeamPage={isTeamPage} />;
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
