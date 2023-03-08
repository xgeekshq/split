import React, { ReactNode, VFC } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';
import { FormProvider, useForm } from 'react-hook-form';

import Input from '@/components/Primitives/Inputs/Input';

export default {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: dedent`
        Specifies an input field where the user can enter data.

        The border color and below text are controlled by the validation of the form the input is in. As well as whether the helper text or an error message appears.

        **File Path:**
        \`@/components/Primitives/Input/index.tsx\` and \`@/components/Primitives/Input/styles.tsx\` 
        `,
      },
    },
  },
  args: {
    id: 'inputId',
    type: 'text',
    disabled: false,
    helperText: "I'm the Helper Text",
    icon: 'search',
    iconPosition: 'left',
    maxChars: '50',
    placeholder: 'Input Text Box',
    showCount: false,
  },
  argTypes: {
    id: {
      control: false,
      description: "Input's id. Identifies the input in the form.",
    },
    type: {
      description: 'Specifies the type to display.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the input.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      defaultValue: false,
    },
    helperText: {
      description: 'Section that allows quick hints for the user.',
    },
    icon: {
      description: 'Name of the icon to display.',
    },
    iconPosition: {
      description: 'Position where the icon will be displayed.',
    },
    maxChars: {
      description: 'Maximum number of characters the input value is allowed to have.',
    },
    placeholder: {
      description: 'Placeholder text that will appear when the input is empty.',
    },
    showCount: {
      description:
        'Whether to show the comparison between the amount of characters that the input value has currently and the maximum number of characters that it is allowed to have.',
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

const Template: ComponentStory<typeof Input> = ({ ...args }) => (
  <StorybookFormProvider>
    <Input {...args} />
  </StorybookFormProvider>
);

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
