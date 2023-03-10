import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Button/Button';

export default {
  title: 'Primitives/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A modal dialog that interrupts the user requesting some type of confirmation.

        **File Path:**
        \`@/components/Primitives/ConfirmationDialog.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Title',
    description: 'Are you sure you want to confirm?',
    confirmationHandler: () => alert('Confirmed!'),
    confirmationLabel: 'Confirm',
    tooltip: 'Tooltip',
    variant: 'danger',
  },
  argTypes: {
    children: {
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
    tooltip: {
      description:
        'The content to be displayed inside the tooltip. Controls whether the tooltip is shown.',
    },
  },
};

const Template: ComponentStory<typeof ConfirmationDialog> = (args) => (
  <ConfirmationDialog {...args}>
    <Button isIcon>
      <Icon name="user" />
    </Button>
  </ConfirmationDialog>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
