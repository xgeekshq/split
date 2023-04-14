import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const Footer = styled(Flex, {
  borderTop: '1px solid $primary200',
  padding: '$18 $40',
  backgroundColor: 'white',
});

export type CreateFooterProps = {
  disableButton: boolean;
  hasError?: boolean;
  handleBack: () => void;
  formId: string;
  confirmationLabel: string;
};

const CreateFooter = ({
  disableButton,
  hasError = false,
  handleBack,
  formId,
  confirmationLabel,
}: CreateFooterProps) => (
  <Footer data-testid="createFooter" gap="24" justify="end">
    <Button disabled={disableButton} onClick={handleBack} type="button" variant="lightOutline">
      Cancel
    </Button>
    <Button disabled={disableButton || hasError} form={formId} type="submit">
      {confirmationLabel}
    </Button>
  </Footer>
);

export default CreateFooter;
