import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '../../styles';

const ColumnSettings: React.FC = ({ children }) => (
  <StyledAccordionItem value="columns">
    <StyledAccordionHeader>
      <StyledAccordionTrigger>
        <Text heading="5">Columns</Text>
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

export { ColumnSettings };
