import { ComponentStory } from '@storybook/react';

import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { TeamFactory } from '@/utils/factories/team';
import { useSession } from 'next-auth/react';
import { createTeamUser } from '../utils/createTeamUser';

export default {
  title: 'Teams/CardBody',
  component: CardBody,
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

const Template: ComponentStory<typeof CardBody> = ({ team, isTeamPage }) => {
  const { data: session } = useSession();
  const user: any = session?.user!;

  if (user.isMember) {
    createTeamUser(user, team);
  }

  return <CardBody userId={user.id} team={team} isTeamPage={isTeamPage} />;
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
