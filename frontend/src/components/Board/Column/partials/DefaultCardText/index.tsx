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
import Separator from '@/components/Primitives/Separator';
import { ReactNode, useRef } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import { FormProvider, useForm } from 'react-hook-form';
import { styled } from '@/styles/stitches/stitches.config';
import Button from '@/components/Primitives/Button';
import { ButtonsContainer } from '@/components/Board/SplitBoard/Settings/styles';
import useColumn from '@/hooks/useColumn';
import CardType from '@/types/card/card';
import { SchemaDefaultCardText } from '@/schema/schemaDefaultCardText';
import TextArea from '@/components/Primitives/TextArea';
import Text from '@/components/Primitives/Text';

type DefaultCardTextProps = {
  boardId: string;
  columnId: string;
  columnTitle: string;
  columnColor: string;
  cards: CardType[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  cardText?: string;
};

const StyledForm = styled('form', Flex, { width: '100%', backgroundColor: 'transparent' });

const DefaultCardText: React.FC<DefaultCardTextProps> = ({
  boardId,
  columnId,
  columnTitle,
  columnColor,
  cardText,
  cards,
  isOpen,
  setIsOpen,
  children,
}) => {
  const {
    updateColumn: { mutate },
  } = useColumn();

  const methods = useForm<{ text: string }>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      text: cardText || 'Write your comment here...',
    },
    resolver: joiResolver(SchemaDefaultCardText),
  });

  const watchCardTextInput = methods.watch();
  const disabledButton = watchCardTextInput.text?.trim().length === 0;

  // References
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = (text: string) => {
    const column = {
      _id: columnId,
      title: columnTitle,
      color: columnColor,
      cards,
      cardText: text,
      boardId,
      isDefaultText: false,
    };

    mutate(column);

    handleClose();
  };

  return (
    <AlertDialog open={isOpen}>
      {children}
      <AlertDialogContent handleClose={handleClose}>
        <DialogTitleContainer css={{ px: '$24' }} align="center" justify="between">
          <StyledDialogTitle heading="4">Activate card default text</StyledDialogTitle>

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
          <StyledForm onSubmit={methods.handleSubmit(({ text }) => handleConfirm(text))}>
            <Flex direction="column" css={{ width: '100%' }}>
              <Separator css={{ backgroundColor: '$primary100' }} />
              <Flex direction="column" css={{ width: '100%', px: '$32', pt: '$24' }}>
                <Text size="md" color="primary400" weight="regular">
                  This default text will be visible as placeholder when someone is creating a new
                  card.
                </Text>
                <TextArea
                  floatPlaceholder={false}
                  id="text"
                  placeholder={cardText || 'Write your comment here...'}
                />
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
                  disabled={disabledButton}
                  ref={submitBtnRef}
                >
                  Update column name
                </Button>
              </ButtonsContainer>
            </Flex>
          </StyledForm>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DefaultCardText;
