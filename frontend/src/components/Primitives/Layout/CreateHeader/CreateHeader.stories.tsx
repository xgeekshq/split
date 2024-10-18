import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';

export default {
  title: 'Primitives/Layout/CreateHeader',
  component: CreateHeader,
  parameters: {
    layout: 'start',
    docs: {
      description: {
        component: dedent`
        Header used in create pages.

        **File Path:**
        \`@/components/Primitives/Layout/CreateHeader/CreateHeader.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Create New Lorem',
    disableBack: false,
    handleBack: () => alert('Go Back'),
  },
  argTypes: {
    title: {
      description: 'Header Title.',
    },
    disableBack: {
      description: 'Used to disable the back button.',
    },
    handleBack: {
      description: 'Function executed when the back button is clicked.',
    },
  },
};

const Template: StoryFn<typeof CreateHeader> = ({ ...args }) => <CreateHeader {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
