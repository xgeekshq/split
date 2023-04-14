import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

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
  <Header align="center" data-testid="createHeader" justify="between">
    <Text color="primary800" fontWeight="bold" heading={3}>
      {title}
    </Text>
    <Button isIcon disabled={disableBack} onClick={handleBack} size="lg">
      <Icon css={{ color: '$primaryBase' }} name="close" />
    </Button>
  </Header>
);

export default CreateHeader;
