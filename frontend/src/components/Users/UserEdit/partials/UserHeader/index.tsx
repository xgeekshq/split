import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { AddNewBoardButton } from '@/components/layouts/DashboardLayout/styles';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import Icon from '@/components/icons/Icon';
import { TitleSection } from './styles';

type UserHeaderProps = {
  firstName: string | string[] | undefined;
  lastName: string | string[] | undefined;
  isSAdmin: string | string[] | undefined;
};

const UserHeader = ({ firstName, lastName, isSAdmin }: UserHeaderProps) => {
  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    {
      title: 'Users',
      link: '/users',
    },
    {
      title: `${firstName} ${lastName}`,
      isActive: true,
    },
  ];
  return (
    <Flex align="center" justify="between" css={{ width: '100%' }}>
      <Flex direction="column">
        <Flex align="center" css={{ pb: '$12' }}>
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <TitleSection>
          <Text heading="1">
            {firstName} {lastName}
          </Text>
          {isSAdmin === 'true' && (
            <Text
              css={{
                ml: '$14',
                background: '$primary1000',
                borderStyle: 'solid',
                borderColor: '$primary900',
                borderWidth: 'thin',
                color: '$primary900',
                borderRadius: '$12',
                padding: '$8',
                height: '1.55rem',
                lineHeight: '$8',
              }}
              size="sm"
              weight="medium"
            >
              SUPER ADMIN
            </Text>
          )}
        </TitleSection>
      </Flex>
      <Flex justify="end" css={{ height: '$10 ' }}>
        <AddNewBoardButton size="sm">
          <Icon css={{ color: 'white' }} name="plus" />
          Add user to new team
        </AddNewBoardButton>
      </Flex>
    </Flex>
  );
};

export default UserHeader;
