import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '../../styles';

type Props = {
  variant?: 'first' | 'others';
};

const ConfigurationSettings: React.FC<Props> = ({ variant, children }) => (
  <StyledAccordionItem value="configurations" variant={variant ?? 'others'}>
    <StyledAccordionHeader variant={variant ?? 'others'}>
      <StyledAccordionTrigger>
        <Text heading="5">Configurations</Text>
        <StyledAccordionIcon name="arrow-down" />
      </StyledAccordionTrigger>
    </StyledAccordionHeader>
    <StyledAccordionContent>
      <Flex direction="column" gap={16}>
        {children}
      </Flex>
    </StyledAccordionContent>
  </StyledAccordionItem>
);

export { ConfigurationSettings };
