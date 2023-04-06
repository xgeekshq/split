import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Button from '@/components/Primitives/Inputs/Button/Button';

export default {
  title: 'Primitives/Alerts/AlertDialog',
  component: AlertDialog,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A modal dialog that interrupts the user with important content and expects a response.

        **File Path:**
        \`@/components/Primitives/Alerts/AlertDialog/AlertDialog.tsx\``,
      },
    },
  },
  args: {
    title: 'Alert Dialog Title',
    children:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos cum consequuntur quo beatae repudiandae quibusdam ratione dolorum, suscipit expedita nisi accusantium porro hic eligendi molestias dolore, quae officia nihil nemo.',
  },
  argTypes: {
    title: {
      description: 'An accessible name to be announced when the dialog is opened.',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'Contains content to be rendered when the dialog is open.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

const Template: ComponentStory<typeof AlertDialog> = ({ children, ...args }) => (
  <AlertDialog>
    {/* Button to Open the Dialog */}
    <AlertDialogTrigger asChild>
      <Button>Open Alert Dialog</Button>
    </AlertDialogTrigger>

    {/* Actual Dialog */}
    <AlertDialogContent {...args}>
      {children}
      <Flex justify="end" gap="16">
        <AlertDialogCancel variant="primaryOutline">Cancel</AlertDialogCancel>
        <AlertDialogAction>Action</AlertDialogAction>
      </Flex>
    </AlertDialogContent>
  </AlertDialog>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
