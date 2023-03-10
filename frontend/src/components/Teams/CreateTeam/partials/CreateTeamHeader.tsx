import { styled } from '@/styles/stitches/stitches.config';

import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Layout/Flex';
import Icon from '@/components/Primitives/Icon';
import Text from '@/components/Primitives/Text';

const Header = styled('header', Flex, {
  borderBottom: '1px solid $primary200',
  padding: '$24 $40',
  backgroundColor: '$white',
});

type CreateTeamHeaderProps = {
  title: string;
  disableBack: boolean;
  handleBack: () => void;
};

const CreateTeamHeader = ({ title, disableBack, handleBack }: CreateTeamHeaderProps) => (
  <Header align="center" justify="between">
    <Text color="primary800" heading={3} fontWeight="bold">
      {title}
    </Text>
    <Button isIcon size="lg" disabled={disableBack} onClick={handleBack}>
      <Icon css={{ color: '$primaryBase' }} name="close" />
    </Button>
  </Header>
);

export default CreateTeamHeader;
