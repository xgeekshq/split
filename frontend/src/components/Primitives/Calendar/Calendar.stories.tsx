import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import dedent from 'ts-dedent';

import Calendar from '@/components/Primitives/Calendar/Calendar';

export default {
  title: 'Primitives/Calendar/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component: dedent`
        
        The calendar component allows users to easily change the displayed day, month, and year. The current day is highlighted and can be changed by clicking on a different date. 
        To change the month or year, users can use the navigation controls, such as arrow buttons or the menu, to move forward or backward through time. 

        **File Path:**
        \`@/components/Primitives/Calendar/Calendar\``,
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
      description: 'Minimum date that the user can select.',
      table: {
        type: { summary: 'Date' },
      },
    },
    maxDate: {
      control: false,
      description: 'Maximum date that the user can select.',
      table: {
        type: { summary: 'Date' },
      },
    },
    tileContent: {
      control: false,
      description:
        'Allows to render custom content within a given calendar item (day on month view, month on year view and so on).',
      table: {
        type: { summary: 'TileContentFunc | React.ReactNode' },
      },
    },
  },
};

const Template: ComponentStory<typeof Calendar> = () => {
  const [currentDate, setDate] = useState<Date>();

  return (
    <>
      <Calendar currentDate={currentDate} setDate={setDate} />
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
