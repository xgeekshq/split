import React from 'react';
import { ComponentStory } from '@storybook/react';
import { Sidebar } from '@/components/Sidebar';

export default {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'start',
    docs: {
      description: {
        component: '',
      },
    },
  },
  args: {
    firstName: 'Guido',
    lastName: 'Pereira',
    email: 'g.pereira@kigroup.de',
    strategy: 'local',
  },
};

const Template: ComponentStory<typeof Sidebar> = ({ ...args }) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
