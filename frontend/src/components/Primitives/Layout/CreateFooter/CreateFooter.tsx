import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Button from '@/components/Primitives/Inputs/Button/Button';

const Footer = styled(Flex, {
  borderTop: '1px solid $primary200',
  padding: '$18 $40',
  backgroundColor: 'white',
});

type CreateFooterProps = {
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
  <Footer gap="24" justify="end">
    <Button disabled={disableButton} type="button" variant="lightOutline" onClick={handleBack}>
      Cancel
    </Button>
    <Button form={formId} disabled={disableButton || hasError} type="submit">
      {confirmationLabel}
    </Button>
  </Footer>
);

export default CreateFooter;
