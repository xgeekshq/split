import React, { useState } from 'react';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import DatePicker from '@/components/Primitives/DatePicker/DatePicker';

export default {
  title: 'Primitives/DatePicker/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: dedent`
        
        The DatePicker component allows users to easily choose a date and display it.

        **File Path:**
        \`@/components/Primitives/DatePicker/DatePicker\``,
      },
      source: {
        code: null,
      },
    },
  },
  argTypes: {
    setDate: {
      control: false,
      description: 'Event handler called when the date state of the calendar changes.',
      table: {
        type: { summary: '(date: Date) => void' },
      },
    },
    currentDate: {
      control: false,
      description: 'The current date of the calendar',
      table: {
        type: { summary: 'Date' },
      },
    },
    minDate: {
      control: false,
      description: 'The minimum date of the calendar',
      table: {
        type: { summary: 'Date' },
      },
    },
    maxDate: {
      control: false,
      description: 'The maximum date of the calendar',
      table: {
        type: { summary: 'Date' },
      },
    },
  },
};

const Template: StoryFn<typeof DatePicker> = () => {
  const [currentDate, setDate] = useState<Value>();

  return (
    <>
      <DatePicker currentDate={currentDate as Date | undefined} setDate={setDate} />
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
