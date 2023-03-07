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
  argTypes: {
    team: {
      type: { required: true },
      description: 'Team to be displayed',
      table: {
        type: { summary: 'Team' },
      },
    },
    isTeamPage: {
      description: 'If the component is being used in a Team Page',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
};

const Template: ComponentStory<typeof TeamItem> = ({ team, isTeamPage }) => {
  const { data: session } = useSession();
  const user: any = session?.user!;

  if (user.isMember) {
    createTeamUser(user, team);
  }

  return <TeamItem team={team} isTeamPage={isTeamPage} />;
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
