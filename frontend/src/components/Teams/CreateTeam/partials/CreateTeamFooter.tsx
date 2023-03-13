import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Button from '@/components/Primitives/Inputs/Button/Button';

const Footer = styled(Flex, {
  borderTop: '1px solid $primary200',
  padding: '$18 $40',
  backgroundColor: 'white',
});

type CreateTeamFooterProps = {
  disableButton: boolean;
  handleBack: () => void;
};

const CreateTeamFooter = ({ disableButton, handleBack }: CreateTeamFooterProps) => (
  <Footer gap="24" justify="end">
    <Button disabled={disableButton} type="button" variant="lightOutline" onClick={handleBack}>
      Cancel
    </Button>
    <Button form="hook-form" disabled={disableButton} type="submit">
      Create team
    </Button>
  </Footer>
);

export default CreateTeamFooter;
