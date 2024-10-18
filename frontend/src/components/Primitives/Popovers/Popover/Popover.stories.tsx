import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';
import { PopoverSizeType, PopoverVariantType } from '@/stories/types/PrimitiveTypes';

const VARIANT_OPTIONS: PopoverVariantType[] = ['dark', 'light'];
const SIZE_OPTIONS: PopoverSizeType[] = ['sm', 'md'];

export default {
  title: 'Primitives/Popovers/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Displays rich content in a portal, triggered by a button.

        **File Path:**
        \`@/components/Primitives/Popovers/Popover/Popover.tsx\`
        `,
      },
    },
  },
  args: {
    variant: 'dark',
    size: 'md',
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the popover trigger.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    active: {
      control: false,
      description: "Maintain item's state as active",
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: 'select' },
      description: 'The component variations. It changes the style of the popover trigger.',
      table: {
        type: { summary: VARIANT_OPTIONS.join('|') },
      },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: 'select' },
      description: 'The component size.',
      table: {
        type: { summary: SIZE_OPTIONS.join('|') },
        defaultValue: { summary: 'md' },
      },
      defaultValue: 'md',
    },
  },
};

const Template: StoryFn<typeof Popover> = ({ variant, size, disabled }: any) => {
  const [selectedOption, setSelectedOption] = useState('sort');

  return (
    <>
      <Popover>
        <PopoverTrigger disabled={disabled} size={size} variant={variant}>
          <Icon name="menu-dots" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverClose>
            <PopoverItem
              active={selectedOption === 'sort_desc'}
              onClick={() => setSelectedOption('sort_desc')}
            >
              <Icon name="sort_desc" />
              <Text size="sm">Sort (desc)</Text>
            </PopoverItem>
          </PopoverClose>
          <PopoverClose>
            <PopoverItem
              active={selectedOption === 'sort_asc'}
              onClick={() => setSelectedOption('sort_asc')}
            >
              <Icon name="sort_asc" />
              <Text size="sm">Sort (asc)</Text>
            </PopoverItem>
          </PopoverClose>
          <PopoverClose>
            <PopoverItem
              active={selectedOption === 'sort'}
              onClick={() => setSelectedOption('sort')}
            >
              <Icon name="sort" />
              <Text size="sm">No sorting</Text>
            </PopoverItem>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
