import React from 'react';
import { ComponentStory } from '@storybook/react';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Button from '@/components/Primitives/Button';

export default {
  title: 'Primitives/AlertDialog',
  component: AlertDialog,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
  },
  args: {
    title: 'Alert Dialog Title',
    children:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos cum consequuntur quo beatae repudiandae quibusdam ratione dolorum, suscipit expedita nisi accusantium porro hic eligendi molestias dolore, quae officia nihil nemo.',
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
