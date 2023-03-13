import { styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

const TipbarList = styled(Flex, {
  backgroundColor: '$primary800',
  p: '$32',
  pt: '$64',
  maxWidth: '$384',
});

const TipsList = styled('ul', Flex, {
  pl: '$16',
  my: '$0',
});

const Tips = styled('li', Text, {});

type Tip = {
  title: string;
  description: string[];
};

type TipBarProps = {
  iconName: 'blob-idea' | 'blob-info';
  tips: Tip[];
};

const TipBar = ({ iconName, tips }: TipBarProps) => (
  <TipbarList direction="column" justify="start" gap="24">
    <Icon name={iconName} size={48} css={{ mb: '$16' }} />

    {tips &&
      tips.map((tip) => (
        <Flex direction="column" justify="start" gap="8" key={tip.title}>
          <Text heading="6" color="white">
            {tip.title}
          </Text>
          <TipsList direction="column" justify="start" gap="4">
            {tip.description &&
              tip.description.map((desc, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <Tips color="primary100" size="sm" key={`${tip.title}_desc_${idx}`}>
                  {desc}
                </Tips>
              ))}
          </TipsList>
        </Flex>
      ))}
  </TipbarList>
);

export default TipBar;
