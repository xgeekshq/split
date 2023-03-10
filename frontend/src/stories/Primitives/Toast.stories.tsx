import React from 'react';
import { ComponentStory } from '@storybook/react';
import { useSetRecoilState } from 'recoil';
import dedent from 'ts-dedent';

import Toast, { ToastProvider, ToastViewport } from '@/components/Primitives/Toast';
import Button from '@/components/Primitives/Inputs/Button/Button';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const TOAST_MESSAGES = [
  'Your request was a success!',
  'Your request was sent!',
  'You have been warned!',
  'Something went wrong!',
];

export default {
  title: 'Primitives/Toast',
  component: Toast,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component: dedent`
        A succinct message that is displayed temporarily.

        **File Path:**
        \`@/components/Primitives/Toast.tsx\`
        `,
      },
    },
  },
  args: {
    type: ToastStateEnum.SUCCESS,
  },
  argTypes: {
    type: {
      options: [
        ToastStateEnum.SUCCESS,
        ToastStateEnum.INFO,
        ToastStateEnum.WARNING,
        ToastStateEnum.ERROR,
      ],
      control: {
        type: 'select',
        labels: ['Success', 'Info', 'Warning', 'Error'],
      },
      description: 'The component variants.',
      table: {
        type: { summary: ['Success', 'Info', 'Warning', 'Error'].join('|') },
      },
    },
  },
};

const Template: ComponentStory<typeof Toast> = ({ type }: any) => {
  const setToastState = useSetRecoilState(toastState);

  return (
    <ToastProvider duration={7000}>
      <Button
        onClick={() => {
          setToastState({
            open: true,
            type,
            content: TOAST_MESSAGES[type],
          });
        }}
      >
        Click me
      </Button>
      <Toast />
      <ToastViewport
        css={{
          left: 'none',
          right: 0,
          top: 0,
          paddingRight: '2rem',
          paddingTop: '2rem',
        }}
      />
    </ToastProvider>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
