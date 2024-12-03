import React from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';

export default {
  title: 'Primitives/Layout/CreateFooter',
  component: CreateFooter,
  parameters: {
    layout: 'start',
    docs: {
      description: {
        component: dedent`
        Header used in create pages.

        **File Path:**
        \`@/components/Primitives/Layout/CreateFooter/CreateFooter.tsx\`
        `,
      },
    },
  },
  args: {
    disableButton: false,
    hasError: false,
    handleBack: () => alert('Go Back'),
    formId: '',
    confirmationLabel: 'Lorem Ipsum',
  },
  argTypes: {
    disableButton: {
      description: 'Used to disable the footer buttons.',
    },
    hasError: {
      description: 'Used to disable the submit button.',
    },
    handleBack: {
      description: 'Function executed when the back button is clicked.',
    },
    formId: {
      description: 'ID of the form to submit.',
    },
    confirmationLabel: {
      description: 'Confirmation button text.',
    },
  },
};

const Template: StoryFn<typeof CreateFooter> = ({ ...args }) => <CreateFooter {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
