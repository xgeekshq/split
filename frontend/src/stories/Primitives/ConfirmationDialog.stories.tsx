import React from 'react';
import { ComponentStory } from '@storybook/react';

import ConfirmationDialog from '@/components/Primitives/ConfirmationDialog';
import Button from '@/components/Primitives/Button';

export default {
  title: 'Primitives/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
  args: {
    trigger: <Button>Trigger</Button>,
    title: 'Title',
    description: 'Are you sure you want to confirm?',
    confirmationHandler: () => alert('Confirmed!'),
    confirmationLabel: 'Confirm',
    variant: 'danger',
  },
  argTypes: {
    trigger: {
      control: false,
      description: 'A component used to trigger the dialog to open.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    title: {
      description: 'An accessible name to be announced when the dialog is opened.',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      description: 'The description of what needs confirmation.',
      table: {
        type: { summary: 'string' },
      },
    },
    confirmationHandler: {
      description: 'The function that will execute when you confirm.',
    },
    confirmationLabel: {
      description: 'Label of the confirmation button.',
    },
    variant: {
      control: { type: 'select' },
      description: 'Variant of the confirmation dialog buttons.',
    },
  },
};

const Template: ComponentStory<typeof ConfirmationDialog> = (args) => (
  <ConfirmationDialog {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
