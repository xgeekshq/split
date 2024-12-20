import { StoryFn } from '@storybook/react';

import EmptyTeams from '@/components/Teams/TeamsList/EmptyTeams/EmptyTeams';

export default {
  title: 'Teams/EmptyTeams',
  component: EmptyTeams,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
};

const Template: StoryFn<typeof EmptyTeams> = () => <EmptyTeams />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
