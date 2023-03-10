import React from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';
import Tooltip from '@/components/Primitives/Tooltip/Tooltip';
import Button from '@/components/Primitives/Button/Button';
import Icon from '@/components/Primitives/Icon';

export default {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

        **File Path:**
        \`@/components/Primitives/Tooltip/index.jsx\` and \`@/components/Primitives/Tooltip/styles.jsx\`
        `,
      },
    },
  },
  args: {
    content: 'Tooltip content.',
  },
  argTypes: {
    content: {
      type: { required: true },
      description: 'The content to be displayed inside the tooltip.',
    },
    color: {
      description: 'The color of the component.',
    },
    children: {
      type: { required: true },
      control: false,
      description: 'The element that will trigger the tooltip.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

const Template: ComponentStory<typeof Tooltip> = ({ content, color }) => (
  <Tooltip content={content} color={color}>
    <Button isIcon>
      <Icon
        name="info"
        css={{
          '&:hover': { cursor: 'pointer' },
        }}
      />
    </Button>
  </Tooltip>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
