import React, { ReactNode, VFC } from 'react';
import { ComponentStory } from '@storybook/react';

import Input from '@/components/Primitives/Input';
import { FormProvider, useForm } from 'react-hook-form';

export default {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['ref', 'as', 'css'],
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: '', // Change main component description in docs page
      },
    },
  },
  args: {
    id: 'inputId',
    type: 'password',
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
