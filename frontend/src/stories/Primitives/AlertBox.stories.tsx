import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import AlertBox from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '@/components/Primitives/Inputs/Button/Button';

export default {
  title: 'Primitives/AlertBox',
  component: AlertBox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: dedent`
        An alert box that is displayed on the screen to inform or warn the user of something.

        **File Path:**
        \`@/components/Primitives/AlertBox/index.tsx\` and \`@/components/Primitives/AlertBox/styles.tsx\`
        `,
      },
    },
  },
  args: {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    text: 'Aut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    type: 'info',
  },
  argTypes: {
    title: {
      control: false,
      description: 'Content of the title of the alert box.',
    },
    text: {
      control: false,
      description: 'Content of the body of the alert box.',
    },
    type: {
      description: 'Type of the component.',
      control: { type: 'select' },
    },
    children: {
      description: 'Contains content to be rendered inside the box.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
};

const Template: ComponentStory<typeof AlertBox> = ({ ...args }) => <AlertBox {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';

export const WithButton: ComponentStory<typeof AlertBox> = ({ ...args }) => (
  <AlertBox {...args}>
    <Button size="sm">Lorem Ipsum</Button>
  </AlertBox>
);
