import Text from '@/components/Primitives/Text/Text';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { ChildrenProp } from '@/types/common';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '@/components/Board/Settings/styles';

const ColumnSettings = ({ children }: ChildrenProp) => (
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
