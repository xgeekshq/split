// TODO: AlertDialog handle is weird!
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/Primitives/Alerts/AlertDialog/AlertDialog';
import Flex from '@/components/Primitives/Layout/Flex';
import Input from '@/components/Primitives/Inputs/Input/Input';
import { SchemaChangeColumnName } from '@/schema/schemaChangeColumnName';
import { useRef } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { styled } from '@/styles/stitches/stitches.config';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';
import Text from '@/components/Primitives/Text/Text';
import TextArea from '@/components/Primitives/Inputs/TextArea/TextArea';

type UpdateColumnNameProps = {
  boardId: string;
  columnId: string;
  columnTitle: string;
  columnColor: string;
  cards: CardType[];
  isOpen: boolean;
  setIsOpen: (openName: boolean) => void;
  cardText?: string;
  isDefaultText?: boolean;
  type: string;
  socketId: string;
};

const StyledForm = styled('form', Flex, { width: '100%', backgroundColor: 'transparent' });

const UpdateColumnDialog: React.FC<UpdateColumnNameProps> = ({
  boardId,
  columnId,
  columnTitle,
  columnColor,
  cardText,
  cards,
  isOpen,
  setIsOpen,
  isDefaultText,
  type,
  socketId,
}) => {
  const {
    updateColumn: { mutate },
  } = useColumn();

  const methods = useForm<{ title: string; text: string }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: columnTitle,
      text: cardText || 'Write your comment here...',
    },
    values: {
      title: columnTitle,
      text: cardText || 'Write your comment here...',
    },
    resolver: joiResolver(SchemaChangeColumnName),
  });

  const columnTextCard = useWatch({
    control: methods.control,
    name: 'text',
  });

  // References
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = (title: string, text: string) => {
    const columnUpdate = {
      _id: columnId,
      title,
      color: columnColor,
      cards,
      cardText: text,
      boardId,
      isDefaultText: type === 'ColumnName' ? isDefaultText : false,
      socketId,
    };

    mutate(columnUpdate);

    handleClose();
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        title={type === 'ColumnName' ? 'Update column name' : 'Activate card default text'}
        handleClose={handleClose}
      >
        <FormProvider {...methods}>
          <StyledForm
            id="form_dialog"
            onSubmit={methods.handleSubmit(({ title, text }) => {
              handleConfirm(title, text);
            })}
            direction="column"
            gap="16"
          >
            {type === 'ColumnName' ? (
              <Input
                id="title"
                maxChars="30"
                placeholder="Column name"
                type="text"
                showCount
                css={{ mb: '0' }}
              />
            ) : (
              <>
                <Text size="md" color="primary400" fontWeight="regular">
                  This default text will be visible as placeholder when someone is creating a new
                  card.
                </Text>
                <TextArea id="text" placeholder={columnTextCard || 'Write your comment here...'} />
              </>
            )}
            <Flex gap="16" justify="end">
              <AlertDialogCancel variant="primaryOutline" onClick={handleClose}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="primary"
                form="form_dialog"
                ref={submitBtnRef}
                type="submit"
              >
                {type === 'ColumnName' ? 'Update column name' : 'Activate card default text'}
              </AlertDialogAction>
            </Flex>
          </StyledForm>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default UpdateColumnDialog;
