import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import { styled } from '@/styles/stitches/stitches.config';
import { NEXT_PUBLIC_ENABLE_AZURE } from '@/utils/constants';
import Icon from '@/components/icons/Icon';

const StyledFlex = styled(Flex, { width: '100%' });

type LoginSSOProps = {
  handleLoginAzure: () => void;
};

const LoginSSO = ({ handleLoginAzure }: LoginSSOProps) => (
  <StyledFlex direction="column">
    <Text css={{ mt: '$24' }} heading="1">
      Welcome
    </Text>
    <Text size="md" color="primary500" css={{ mt: '$8' }}>
      Choose your preferred login method.
    </Text>
    <Flex align="center" direction="column" justify="center" css={{ mt: '$32' }}>
      {NEXT_PUBLIC_ENABLE_AZURE && (
        <Button
          variant="primaryOutline"
          onClick={handleLoginAzure}
          css={{ display: 'flex', width: '100%', fontWeight: '$regular' }}
        >
          <Icon css={{ width: '$60', height: '$60' }} name="microsoft" />
          Login with Microsoft
        </Button>
      )}
    </Flex>
  </StyledFlex>
);

export default LoginSSO;
