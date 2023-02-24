import React from 'react';
import { ComponentStory } from '@storybook/react';

import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { mockTeam } from '../mocks/teamCard_team';

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
    userId: '63bfe967f36aa91d9bdc08cf',
    teamId: '63d25ad49f8fe5f504de6229',
    team: mockTeam,
    isTeamPage: false,
  },
};

const Template: ComponentStory<typeof CardBody> = ({ userId, teamId, team, isTeamPage }) => (
  <CardBody userId={userId} teamId={teamId} team={team} isTeamPage={isTeamPage} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
