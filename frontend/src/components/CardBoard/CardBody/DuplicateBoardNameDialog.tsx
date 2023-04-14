import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

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
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import SchemaDuplicateBoard from '@/schema/schemaDuplicateBoardForm';

export type DuplicateBoardNameDialogProps = {
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
            data-testid="duplicateBoardTrigger"
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
        handleClose={handleClose}
        title="Duplicate Board"
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
              <AlertDialogCancel onClick={handleClose} type="button" variant="primaryOutline">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-testid="duplicateBoardSubmit"
                disabled={!methods.formState.isDirty || !methods.formState.isValid}
                type="submit"
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
