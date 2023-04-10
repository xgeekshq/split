import BannerIcon from '@/components/Sidebar/Banner/Banner';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Separator from '@/components/Primitives/Separator/Separator';
import Link from 'next/link';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { sidebarState } from '@/store/sidebar/atom/sidebar.atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BannerContainer, MenuButton } from './styles';
import { CollapsibleContent } from '../styles';

export type SidebarHeaderProps = { firstName: string; lastName: string; email: string };

const Header = ({ firstName, lastName, email }: SidebarHeaderProps) => {
  const initialLetters = firstName.charAt(0) + lastName.charAt(0);

  const { collapsed } = useRecoilValue(sidebarState);
  const setSidebarState = useSetRecoilState(sidebarState);

  return (
    <Flex direction="column" data-testid="sidebarHeader">
      <BannerContainer align="center">
        <Link href={DASHBOARD_ROUTE}>
          <Flex pointer>
            <BannerIcon />
          </Flex>
        </Link>
        <MenuButton
          isIcon
          size="lg"
          onClick={() => setSidebarState({ collapsed: !collapsed })}
          aria-expanded={!collapsed}
        >
          <Icon name="menu" />
        </MenuButton>
      </BannerContainer>
      <CollapsibleContent direction="column" collapsed={{ '@initial': collapsed, '@md': false }}>
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
            css={{ width: '58px', height: '58px', position: 'relative' }}
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
            <Text color="primary800" css={{ zIndex: 1 }} size="md" fontWeight="bold">
              {initialLetters}
            </Text>
          </Flex>
          <Flex direction="column" css={{ width: '80%' }}>
            <Text
              color="white"
              css={{
                textOverflow: 'ellipsis',
                width: '100%',
                overflow: 'hidden',
                wordBreak: 'keep-all',
              }}
              size="sm"
              fontWeight="medium"
            >
              {`${firstName} ${lastName}`}
            </Text>
            <Text
              color="primary200"
              css={{
                textOverflow: 'ellipsis',
                width: '100%',
                overflow: 'hidden',
              }}
              size="xs"
              fontWeight="medium"
            >
              {email}
            </Text>
          </Flex>
        </Flex>
        <Separator css={{ backgroundColor: '$primary600' }} />
      </CollapsibleContent>
    </Flex>
  );
};

export default Header;
