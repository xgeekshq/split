import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';
import dedent from 'ts-dedent';

import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

export default {
  title: 'Primitives/Dialogs/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: dedent`
        A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

        The Dialog primitive has two complements. The Dialog.Header and the Dialog.Footer. The Dialog.Header receives a title and the Dialog.Footer receives a handler in case of cancelation, 
        a handler in case of confirmation, the content of the confirm button, the ref of the confirm button and whether or not to show the top separator.

        **File Path:**
        \`@/components/Primitives/Dialogs/Dialog/Dialog.tsx\`,
        \`@/components/Primitives/Dialogs/Dialog/DialogHeader.tsx\`,
        \`@/components/Primitives/Dialogs/Dialog/DialogFooter.tsx\` and
        \`@/components/Primitives/Dialogs/Dialog/styles.tsx\`
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: false,
      description: 'The controlled open state of the dialog.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    setIsOpen: {
      control: false,
      description: 'Event handler called when the open state of the dialog changes.',
      table: {
        type: { summary: '() => void' },
      },
    },
    title: {
      control: false,
      description: 'Dialog.Header prop. Title of the dialog.',
      table: {
        type: { summary: 'string' },
      },
    },
    handleAffirmative: {
      control: false,
      description: 'Dialog.Footer prop. Event handler called when the confirm button is pressed.',
      table: {
        type: { summary: '() => void' },
      },
    },
    handleClose: {
      control: false,
      type: { required: true },
      description:
        'Dialog.Footer prop. Event handler called when the cancel button is pressed. Required in case you want to use Dialog.Footer.',
      table: {
        type: { summary: '() => void' },
      },
    },
    affirmativeLabel: {
      control: false,
      description: 'Dialog.Footer prop. Content of the confirm button.',
      table: {
        type: { summary: 'string' },
      },
    },
    buttonRef: {
      control: false,
      description: 'Dialog.Footer prop. Ref of the confirm button.',
      table: {
        type: { summary: 'React.RefObject<HTMLButtonElement>' },
      },
    },
    showSeparator: {
      control: false,
      description: 'Dialog.Footer prop. Whether to show the top separator (border).',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
};

const Template: StoryFn<typeof Dialog> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Click me
      </Button>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Dialog.Header title="Dialog Title" />
        <Flex
          align="center"
          css={{ height: '100%', overflow: 'auto' }}
          direction="column"
          justify="center"
        >
          Dialog Content
        </Flex>
        <Dialog.Footer
          affirmativeLabel="Confirm"
          handleAffirmative={handleClick}
          handleClose={handleClick}
        />
      </Dialog>
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
