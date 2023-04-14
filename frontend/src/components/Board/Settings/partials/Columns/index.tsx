import {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionItem,
  StyledAccordionTrigger,
} from '@/components/Board/Settings/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { ChildrenProp } from '@/types/common';

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
