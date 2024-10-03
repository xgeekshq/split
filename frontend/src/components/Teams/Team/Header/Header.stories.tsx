import { StoryFn } from '@storybook/react';

import Header from '@/components/Teams/Team/Header/Header';

export default {
  title: 'Teams/Header',
  component: Header,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
  args: {
    title: 'My Team',
    hasPermissions: true,
  },
  argTypes: {
    title: {
      type: { required: true, name: 'string' },
      description: 'Team Name',
      table: {
        type: { summary: 'string' },
      },
    },
    hasPermissions: {
      type: { required: true, name: 'boolean' },
      description:
        "Controls if the User is able to add/remove members (plase don't cancel the dialog)",
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
};

const Template: StoryFn<typeof Header> = (props) => <Header {...props} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
