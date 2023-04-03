import { ComponentStory } from '@storybook/react';
import EmptyTeams from './EmptyTeams';

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

const Template: ComponentStory<typeof EmptyTeams> = () => <EmptyTeams />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
