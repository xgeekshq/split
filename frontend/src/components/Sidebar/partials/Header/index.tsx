import HeaderBannerIcon from '@/components/icons/HeaderBanner';
import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Separator from '../Separator';
import { StyledHeader } from './styles';

type Props = { firstName: string; lastName: string; email: string };

const Header = ({ firstName, lastName, email }: Props) => {
  const initialLetters = firstName.charAt(0) + lastName.charAt(0);

  return (
    <StyledHeader direction="column">
      <Flex align="center" css={{ p: '$40' }} justify="center">
        <HeaderBannerIcon />
      </Flex>
      <Separator />
      <Flex
        align="center"
        gap="12"
        css={{
          p: '$24',
          color: '$white',
          backgroundColor: '$primary700',
        }}
      >
        <Flex
          align="center"
          css={{ width: '57px', height: '58px', position: 'relative' }}
          justify="center"
        >
          <Icon
            name="userIcon"
            css={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              bottom: '0',
              zIndex: '0',
              left: '0',
              right: '0',
            }}
          />
          <Text color="primary800" css={{ zIndex: 1 }} size="md" weight="bold">
            {initialLetters}
          </Text>
        </Flex>
        <Flex direction="column">
          <Text css={{ color: '$white' }} size="sm" weight="medium">
            {`${firstName} ${lastName}`}
          </Text>
          <Text css={{ color: '$primary200' }} size="xs" weight="medium">
            {email}
          </Text>
        </Flex>
      </Flex>
      <Separator />
    </StyledHeader>
  );
};

export default Header;
