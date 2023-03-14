import { styled } from '@/styles/stitches/stitches.config';

import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Text from '@/components/Primitives/Text/Text';

const Header = styled('header', Flex, {
  borderBottom: '1px solid $primary200',
  padding: '$24 $40',
  backgroundColor: '$white',
});

export type CreateHeaderProps = {
  title: string;
  disableBack: boolean;
  handleBack: () => void;
};

const CreateHeader = ({ title, disableBack, handleBack }: CreateHeaderProps) => (
  <Header align="center" justify="between" data-testid="createHeader">
    <Text color="primary800" heading={3} fontWeight="bold">
      {title}
    </Text>
    <Button isIcon size="lg" disabled={disableBack} onClick={handleBack}>
      <Icon css={{ color: '$primaryBase' }} name="close" />
    </Button>
  </Header>
);

export default CreateHeader;
