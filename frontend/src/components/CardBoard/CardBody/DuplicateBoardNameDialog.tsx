import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import SchemaDuplicateBoard from '@/schema/schemaDuplicateBoardForm';
import { joiResolver } from '@hookform/resolvers/joi';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';

type DuplicateBoardNameDialogProps = {
  handleDuplicateBoard: (title: string) => void;
  boardTitle: string;
};

const DuplicateBoardNameDialog = ({
  handleDuplicateBoard,
  boardTitle,
}: DuplicateBoardNameDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const methods = useForm<{ title: string }>({
    mode: 'onChange',
    defaultValues: {
      title: boardTitle,
    },
    reValidateMode: 'onChange',
    resolver: joiResolver(SchemaDuplicateBoard),
  });

  const handleClose = () => {
    methods.setValue('title', boardTitle);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip content="Duplicate board">
        <AlertDialogTrigger asChild>
          <Button
            isIcon
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Icon
              name="clone"
              css={{
                color: '$primary400',
              }}
            />
          </Button>
        </AlertDialogTrigger>
      </Tooltip>
      <AlertDialogContent
        css={{ top: '200px', flexDirection: 'column' }}
        title="Duplicate Board"
        handleClose={handleClose}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(({ title }) => {
              handleDuplicateBoard(title);
              handleClose();
            })}
          >
            <Flex direction="column" gap={8}>
              <Text>Choose a name for the new duplicated board:</Text>
              <Input id="title" maxChars="45" placeholder="Board title" type="text" />
            </Flex>
            <Flex css={{ mt: '$32' }} gap="24" justify="end">
              <AlertDialogCancel variant="primaryOutline" type="button" onClick={handleClose}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={!methods.formState.isDirty || !methods.formState.isValid}
              >
                Duplicate
              </AlertDialogAction>
            </Flex>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuplicateBoardNameDialog;
