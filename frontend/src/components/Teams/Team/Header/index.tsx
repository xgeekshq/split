import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TitleSection } from './styles';

type TeamHeaderProps = {
  title: string;
};

const TeamHeader = ({ title }: TeamHeaderProps) => {
  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    {
      title: 'Teams',
      link: '/teams',
    },
  ];

  breadcrumbItems.push({
    title,
    isActive: true,
  });
  return (
    <Flex align="center" justify="between">
      <Flex direction="column">
        <Flex align="center" css={{ pb: '$12' }}>
          <Breadcrumb items={breadcrumbItems} />
        </Flex>
        <TitleSection>
          <Text heading="1">{title}</Text>
        </TitleSection>
      </Flex>
    </Flex>
  );
};

export default TeamHeader;
