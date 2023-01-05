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
    <Text css={{ mt: '$8', color: '$primary500' }} size="md">
      Choose your preferred login method.
    </Text>
    <Flex align="center" direction="column" justify="center">
      {NEXT_PUBLIC_ENABLE_AZURE && (
        <Button
          variant="primaryOutline"
          onClick={handleLoginAzure}
          css={{ display: 'flex', width: '100%' }}
        >
          <Icon css={{ width: '$60', height: '$60' }} name="microsoft" />
          <Text css={{ flexGrow: 1, textAlign: 'start' }}>Login with Microsoft</Text>
        </Button>
      )}
    </Flex>
  </StyledFlex>
);

export default LoginSSO;
