import Icon from '@/components/icons/Icon';
import {
  DialogTitleContainer,
  StyledDialogTitle,
} from '@/components/Primitives/AlertCustomDialog/styles';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/Primitives/AlertDialog';
import Flex from '@/components/Primitives/Flex';
import Input from '@/components/Primitives/Input';
import Separator from '@/components/Primitives/Separator';
import { SchemaChangeColumnName } from '@/schema/schemaChangeColumnName';
import { ReactNode, useRef } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { styled } from '@/styles/stitches/stitches.config';
import Button from '@/components/Primitives/Button';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';
import { ButtonsContainer } from '@/components/Board/Settings/styles';
import Text from '@/components/Primitives/Text';
import TextArea from '@/components/Primitives/TextArea';

type UpdateColumnNameProps = {
  boardId: string;
  columnId: string;
  columnTitle: string;
  columnColor: string;
  cards: CardType[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  cardText?: string;
  isDefaultText?: boolean;
  type: string;
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
  children,
  isDefaultText,
  type,
}) => {
  const {
    updateColumn: { mutate },
  } = useColumn();

  const methods = useForm<{ title: string; text: string }>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: columnTitle || '',
      text: cardText || 'Write your comment here...',
    },
    resolver: joiResolver(SchemaChangeColumnName),
  });

  const columnName = useWatch({
    control: methods.control,
    name: 'title',
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
    };

    mutate(columnUpdate);

    handleClose();
  };

  return (
    <AlertDialog open={isOpen}>
      {children}
      <AlertDialogContent handleClose={handleClose}>
        <DialogTitleContainer css={{ px: '$24' }} align="center" justify="between">
          <StyledDialogTitle heading="4">
            {type === 'ColumnName' ? 'Update column name' : 'Activate card default text'}
          </StyledDialogTitle>

          <AlertDialogCancel
            asChild
            isIcon
            css={{ '@hover': { '&:hover': { cursor: 'pointer' } } }}
            onClick={handleClose}
          >
            <Flex css={{ '& svg': { color: '$primaryBase' } }}>
              <Icon css={{ width: '$24', height: '$24' }} name="close" />
            </Flex>
          </AlertDialogCancel>
        </DialogTitleContainer>
        <FormProvider {...methods}>
          <StyledForm
            id="form_dialog"
            onSubmit={methods.handleSubmit(({ title, text }) => {
              handleConfirm(title, text);
            })}
          >
            <Flex direction="column" css={{ width: '100%' }}>
              <Separator css={{ backgroundColor: '$primary100' }} />
              <Flex direction="column" css={{ width: '100%', px: '$32', pt: '$24' }}>
                {type === 'ColumnName' ? (
                  <Input
                    forceState
                    id="title"
                    maxChars="15"
                    placeholder="Column name"
                    state="default"
                    type="text"
                    showCount
                    currentValue={columnName}
                  />
                ) : (
                  <>
                    <Text size="md" color="primary400" fontWeight="regular">
                      This default text will be visible as placeholder when someone is creating a
                      new card.
                    </Text>
                    <TextArea
                      floatPlaceholder={false}
                      id="text"
                      placeholder={columnTextCard || 'Write your comment here...'}
                    />
                  </>
                )}
              </Flex>
              <ButtonsContainer
                gap={24}
                align="center"
                justify="end"
                css={{
                  backgroundColor: '$white',
                  borderRadius: '$12',
                  border: 'none',
                }}
              >
                <Button
                  css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
                  variant="primaryOutline"
                  onClick={handleClose}
                  type="button"
                >
                  Cancel
                </Button>

                <Button
                  css={{ marginRight: '$32', padding: '$16 $24' }}
                  variant="primary"
                  form="form_dialog"
                  ref={submitBtnRef}
                >
                  {type === 'ColumnName' ? 'Update column name' : 'Activate card default text'}
                </Button>
              </ButtonsContainer>
            </Flex>
          </StyledForm>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default UpdateColumnDialog;
