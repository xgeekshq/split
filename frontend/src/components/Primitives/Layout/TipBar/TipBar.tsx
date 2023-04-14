import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

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

export type TipBarProps = {
  iconName?: 'blob-idea' | 'blob-info';
  tips: Tip[];
};

const TipBar = ({ iconName = 'blob-idea', tips }: TipBarProps) => (
  <TipbarList data-testid="tipbar" direction="column" gap="24" justify="start">
    <Icon css={{ mb: '$16' }} name={iconName} size={48} />

    {tips &&
      tips.map((tip) => (
        <Flex key={tip.title} direction="column" gap="8" justify="start" role="listbox">
          <Text color="white" data-testid="tipbarTitle" heading="6">
            {tip.title}
          </Text>
          <TipsList direction="column" gap="4" justify="start">
            {tip.description &&
              tip.description.map((desc, idx) => (
                <Tips
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${tip.title}_desc_${idx}`}
                  color="primary100"
                  data-testid="tipbarDescription"
                  size="sm"
                >
                  {desc}
                </Tips>
              ))}
          </TipsList>
        </Flex>
      ))}
  </TipbarList>
);

export default TipBar;
