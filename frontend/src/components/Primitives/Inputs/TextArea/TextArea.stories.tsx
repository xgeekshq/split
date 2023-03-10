import React, { VFC, ReactNode } from 'react';
import { ComponentStory } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import dedent from 'ts-dedent';

import TextArea from '@/components/Primitives/Inputs/TextArea/TextArea';

export default {
  title: 'Primitives/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A multi-line text input control.

        The border color of the TextArea component is controlled by the react hook form validator that is used.

        **File Path:**
        \`@/components/Primitives/Inputs/TextArea/TextArea.tsx\`
        `,
      },
    },
  },
  args: {
    placeholder: 'Some text...',
  },
  argTypes: {
    id: {
      control: false,
      description: "Textarea's id. Identifies the text area in the form.",
    },
    placeholder: {
      control: false,
      description: 'Placeholder text that will appear when the text area is empty.',
      table: {
        type: { summary: 'string' },
      },
      defaultValue: false,
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the text area.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
  },
};

const StorybookFormProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

const Template: ComponentStory<typeof TextArea> = ({ placeholder, disabled }) => (
  <StorybookFormProvider>
    <TextArea id="text" placeholder={placeholder} disabled={disabled} />
  </StorybookFormProvider>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
