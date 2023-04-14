import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';
import { NEXT_PUBLIC_ENABLE_AZURE } from '@/utils/constants';

const StyledFlex = styled(Flex, { width: '100%' });

type LoginSSOProps = {
  handleLoginAzure: () => void;
};

const LoginSSO = ({ handleLoginAzure }: LoginSSOProps) => (
  <StyledFlex direction="column">
    <Text css={{ mt: '$24' }} heading="1">
      Welcome
    </Text>
    <Text color="primary500" css={{ mt: '$8' }} size="md">
      Choose your preferred login method.
    </Text>
    <Flex align="center" css={{ mt: '$32' }} direction="column" justify="center">
      {NEXT_PUBLIC_ENABLE_AZURE && (
        <Button
          css={{ display: 'flex', width: '100%' }}
          onClick={handleLoginAzure}
          size="lg"
          variant="primaryOutline"
        >
          <Icon name="microsoft" />
          Login with Microsoft
        </Button>
      )}
    </Flex>
  </StyledFlex>
);

export default LoginSSO;
