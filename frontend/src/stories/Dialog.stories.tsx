import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import dedent from 'ts-dedent';

import Dialog from '@/components/Primitives/Dialog';
import Flex from '@/components/Primitives/Flex';
import Button from '@/components/Primitives/Button';

export default {
  title: 'Primitives/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: dedent`
        **File Path:**
        \`@/components/Primitives/Dialog/index.tsx\`,
        \`@/components/Primitives/Dialog/DialogHeader.tsx\`,
        \`@/components/Primitives/Dialog/DialogFooter.tsx\` and
        \`@/components/Primitives/Dialog/styles.tsx\`
        `,
      },
    },
  },
  args: {},
  argTypes: {},
};

const Template: ComponentStory<typeof Dialog> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
          justify="center"
          direction="column"
          css={{ height: '100%', overflow: 'auto' }}
        >
          Dialog Content
        </Flex>
        <Dialog.Footer
          handleClose={() => {
            setIsOpen(false);
          }}
          affirmativeLabel="Confirm"
        />
      </Dialog>
    </>
  );
};

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
