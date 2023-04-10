import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import BannerIcon from '@/components/Sidebar/Banner/Banner';
import { DASHBOARD_ROUTE } from '@/utils/routes';

export type SidebarHeaderProps = { firstName: string; lastName: string; email: string };

const Header = ({ firstName, lastName, email }: SidebarHeaderProps) => {
  const initialLetters = firstName.charAt(0) + lastName.charAt(0);

  return (
    <Flex data-testid="sidebarHeader" direction="column">
      <Flex align="center" css={{ p: '$40' }} justify="center">
        <Link href={DASHBOARD_ROUTE}>
          <Flex pointer>
            <BannerIcon />
          </Flex>
        </Link>
      </Flex>
      <Separator css={{ backgroundColor: '$primary600' }} />
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
          <Text color="primary800" css={{ zIndex: 1 }} fontWeight="bold" size="md">
            {initialLetters}
          </Text>
        </Flex>
        <Flex css={{ width: '80%' }} direction="column">
          <Text
            color="white"
            fontWeight="medium"
            size="sm"
            css={{
              textOverflow: 'ellipsis',
              width: '100%',
              overflow: 'hidden',
              wordBreak: 'keep-all',
            }}
          >
            {`${firstName} ${lastName}`}
          </Text>
          <Text
            color="primary200"
            fontWeight="medium"
            size="xs"
            css={{
              textOverflow: 'ellipsis',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {email}
          </Text>
        </Flex>
      </Flex>
      <Separator css={{ backgroundColor: '$primary600' }} />
    </Flex>
  );
};

export default Header;
