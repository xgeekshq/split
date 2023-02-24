import React from 'react';
import { ComponentStory } from '@storybook/react';

import CardBody from '@/components/Teams/TeamsList/partials/CardTeam/CardBody';
import { TeamFactory } from '@/utils/factories/team';

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
    team: TeamFactory.create(),
    isTeamPage: false,
  },
};

const Template: ComponentStory<typeof CardBody> = ({ userId, team, isTeamPage }) => (
  <CardBody userId={userId} team={team} isTeamPage={isTeamPage} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
