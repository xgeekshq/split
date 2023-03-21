import React from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Badge from '@/components/Primitives/Badge/Badge';
import { BadgeSizeType, BadgeVariants } from '@/stories/types/PrimitiveTypes';

const SIZE_OPTIONS: BadgeSizeType[] = ['xs', 'sm', 'md', 'lg'];
const VARIANT_OPTIONS: BadgeVariants[] = ['success', 'danger', 'info', 'warning'];

export default {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Primitives/Badge/Badge.tsx\`
        `,
      },
    },
  },
  args: {
    children: 'Lorem Ipsum',
    pill: false,
    variant: 'warning',
  },
  argTypes: {
    pill: {
      control: { type: 'boolean' },
      description: 'Add a rounded border',
      table: {
        type: { summary: 'boolean' },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
      },
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The component variations.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
      },
    },
  },
};

const Template: ComponentStory<typeof Badge> = ({ children, ...args }) => (
  <Badge {...args}>{children}</Badge>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
